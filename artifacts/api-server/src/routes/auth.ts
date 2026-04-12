import { Router } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const JWT_SECRET = process.env.SESSION_SECRET ?? "patent-secret-change-me";

function buildCallbackUri(req: any): string {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;
  const replitDomain = process.env.REPLIT_DEV_DOMAIN;
  if (replitDomain) return `https://${replitDomain}/api/auth/google/callback`;
  const proto = (req.headers["x-forwarded-proto"] as string) ?? "http";
  const host = req.headers.host as string;
  return `${proto}://${host}/api/auth/google/callback`;
}

function makeOAuth2(redirectUri: string) {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
}

async function upsertGoogleUser(googleId: string, name: string, email: string) {
  const userId = `google_${googleId}`;
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  let username: string;
  if (existing.length > 0) {
    username = existing[0].username;
  } else {
    const base = email.split("@")[0].replace(/[^a-z0-9_]/gi, "_").toLowerCase();
    const taken = await db.select({ id: users.id }).from(users).where(eq(users.username, base)).limit(1);
    username = taken.length > 0 ? `g${googleId.slice(0, 8)}` : base;
  }
  const [user] = await db
    .insert(users)
    .values({ id: userId, name, username, bio: "", avatarGradient: "primary" })
    .onConflictDoUpdate({ target: users.id, set: { name } })
    .returning();
  return user;
}

function signJwt(userId: string, name: string, email: string, picture?: string | null): string {
  return jwt.sign({ userId, name, email, picture: picture ?? null }, JWT_SECRET, { expiresIn: "30d" });
}

function closePopupPage(origin: string, token: string | null, error: string | null): string {
  const msg = token
    ? { type: "PATENT_AUTH_DONE", token }
    : { type: "PATENT_AUTH_ERROR", error };
  const safeOrigin = origin ? JSON.stringify(origin) : '"*"';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Patent Auth</title></head>
<body style="background:#0a0a0f;color:#f0f0f8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<p>${token ? "Authenticated!" : (error ?? "Error")}</p>
<script>
(function(){
  var msg = ${JSON.stringify(msg)};
  var origin = ${safeOrigin};
  if(window.opener && !window.opener.closed){
    try{ window.opener.postMessage(msg, origin); } catch(e){ window.opener.postMessage(msg, "*"); }
    setTimeout(function(){ window.close(); }, 300);
  } else {
    document.querySelector("p").textContent = "${token ? "Success! You can close this tab." : (error ?? "Error. Please try again.")}";
  }
})();
</script></body></html>`;
}

router.get("/google", (req, res) => {
  const origin = String(req.query.origin ?? "");
  const callbackOverride = req.query.callback ? String(req.query.callback) : null;
  const redirectUri = callbackOverride ?? buildCallbackUri(req);
  const oauth2 = makeOAuth2(redirectUri);
  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile", "openid"],
    state: Buffer.from(JSON.stringify({ origin, redirectUri })).toString("base64url"),
    prompt: "select_account",
  });
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;
  const error = req.query.error as string | undefined;

  let origin = "";
  try {
    const decoded = Buffer.from(state ?? "", "base64url").toString();
    origin = JSON.parse(decoded).origin ?? "";
  } catch {}

  if (error || !code) {
    return res.send(closePopupPage(origin, null, "Google login was cancelled or failed."));
  }

  try {
    const redirectUri = buildCallbackUri(req);
    const oauth2 = makeOAuth2(redirectUri);
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);

    const oauth2Api = google.oauth2({ version: "v2", auth: oauth2 });
    const { data: gUser } = await oauth2Api.userinfo.get();

    if (!gUser.id || !gUser.email) {
      return res.send(closePopupPage(origin, null, "Could not get user info from Google."));
    }

    const name = gUser.name ?? gUser.email.split("@")[0];
    const user = await upsertGoogleUser(gUser.id, name, gUser.email);
    const token = signJwt(user.id, user.name, gUser.email, gUser.picture);
    res.send(closePopupPage(origin, token, null));
  } catch (err: any) {
    console.error("Google OAuth callback error:", err?.message ?? err);
    res.send(closePopupPage(origin, null, "Authentication failed. Please try again."));
  }
});

router.post("/google/token", async (req, res) => {
  const { accessToken } = req.body as { accessToken?: string };
  if (!accessToken) return res.status(400).json({ error: "accessToken required" });

  try {
    const resp = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${encodeURIComponent(accessToken)}`);
    if (!resp.ok) return res.status(401).json({ error: "Invalid access token" });
    const gUser = (await resp.json()) as { id?: string; email?: string; name?: string; picture?: string };

    if (!gUser.id || !gUser.email) return res.status(400).json({ error: "Missing user info from Google" });

    const name = gUser.name ?? gUser.email.split("@")[0];
    const user = await upsertGoogleUser(gUser.id, name, gUser.email);
    const token = signJwt(user.id, user.name, gUser.email, gUser.picture);
    res.json({ token, userId: user.id, name: user.name, email: gUser.email, picture: gUser.picture });
  } catch (err: any) {
    console.error("Token exchange error:", err?.message ?? err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

router.post("/google/exchange-code", async (req, res) => {
  const { code, redirectUri } = req.body as { code?: string; redirectUri?: string };
  if (!code || !redirectUri) return res.status(400).json({ error: "code and redirectUri required" });

  try {
    const oauth2 = makeOAuth2(redirectUri);
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);

    const oauth2Api = google.oauth2({ version: "v2", auth: oauth2 });
    const { data: gUser } = await oauth2Api.userinfo.get();

    if (!gUser.id || !gUser.email) return res.status(400).json({ error: "Could not get user info from Google" });

    const name = gUser.name ?? gUser.email.split("@")[0];
    const user = await upsertGoogleUser(gUser.id, name, gUser.email);
    const token = signJwt(user.id, user.name, gUser.email, gUser.picture);
    res.json({ token });
  } catch (err: any) {
    console.error("Code exchange error:", err?.message ?? err);
    res.status(500).json({ error: "Code exchange failed" });
  }
});

router.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as {
      userId: string; name: string; email: string; picture: string | null;
    };
    res.json({ userId: payload.userId, name: payload.name, email: payload.email, picture: payload.picture });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
