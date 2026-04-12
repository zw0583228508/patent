import { Router, type Request, type Response } from "express";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

const router = Router();

const storage = new Storage();
const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;

router.post("/upload/presigned", async (req: Request, res: Response) => {
  if (!BUCKET_ID) {
    res.status(503).json({ error: "Object storage not configured" });
    return;
  }

  const { contentType = "image/jpeg", filename = "image.jpg" } = req.body ?? {};

  try {
    const key = `uploads/${randomUUID()}/${filename}`;
    const bucket = storage.bucket(BUCKET_ID);
    const file = bucket.file(key);

    const [uploadUrl] = await file.generateSignedPostPolicyV4({
      expires: Date.now() + 10 * 60 * 1000,
      conditions: [
        ["content-length-range", 0, 10 * 1024 * 1024],
      ],
      fields: { "Content-Type": contentType },
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_ID}/${key}`;

    res.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("Presigned URL error:", err);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.post("/upload/complete", async (req: Request, res: Response) => {
  if (!BUCKET_ID) {
    res.status(503).json({ error: "Object storage not configured" });
    return;
  }

  const { key } = req.body ?? {};
  if (!key) {
    res.status(400).json({ error: "key required" });
    return;
  }

  try {
    const bucket = storage.bucket(BUCKET_ID);
    const file = bucket.file(key);
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${BUCKET_ID}/${key}`;
    res.json({ url: publicUrl });
  } catch (err) {
    console.error("Make public error:", err);
    res.status(500).json({ error: "Failed to make file public" });
  }
});


export default router;
