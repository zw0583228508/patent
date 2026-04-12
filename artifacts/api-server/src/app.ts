import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

if (!process.env.SESSION_SECRET) {
  logger.warn("SESSION_SECRET is not set — using insecure fallback. Set this in production!");
}

const ALLOWED_ORIGINS = (() => {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  const origins = ["http://localhost:8081", "http://localhost:3000", "http://localhost:19006"];
  if (domain) {
    origins.push(`https://${domain}`);
    const parts = domain.split(".");
    if (parts.length >= 2) {
      const base = parts.slice(-2).join(".");
      origins.push(`https://*.${base}`);
    }
  }
  return origins;
})();

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = ALLOWED_ORIGINS.some((o) =>
        o.startsWith("https://*.") ? origin.endsWith(o.slice(9)) : origin === o,
      );
      callback(null, allowed);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
