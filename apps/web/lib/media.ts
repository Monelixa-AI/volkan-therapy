import crypto from "crypto";
import path from "path";

function getMediaConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_MEDIA_BUCKET || "media";
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }
  return { url, key, bucket };
}

function buildStoragePath(filename: string) {
  const ext = path.extname(filename || "") || ".bin";
  const date = new Date();
  const folder = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return `uploads/${folder}/${crypto.randomUUID()}${ext}`;
}

export async function uploadMediaObject(file: File) {
  const { url, key, bucket } = getMediaConfig();
  const storagePath = buildStoragePath(file.name);
  const endpoint = `${url}/storage/v1/object/${bucket}/${storagePath}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type || "application/octet-stream",
      "cache-control": "3600",
      "x-upsert": "true"
    },
    body: buffer
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Upload failed: ${res.status} ${message}`);
  }

  const publicUrl = `${url}/storage/v1/object/public/${bucket}/${storagePath}`;
  return { publicUrl, storagePath, size: buffer.length };
}

export async function deleteMediaObject(storagePath: string) {
  const { url, key, bucket } = getMediaConfig();
  const endpoint = `${url}/storage/v1/object/${bucket}/${storagePath}`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${key}`
    }
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Delete failed: ${res.status} ${message}`);
  }
}
