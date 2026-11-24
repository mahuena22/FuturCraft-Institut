import { mkdir, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { del, put } from "@vercel/blob";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

function safeFilename(name: string) {
  const ext = (name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${Date.now()}-${randomBytes(6).toString("hex")}.${ext || "bin"}`;
}

export function isManagedUploadUrl(url: string | null | undefined) {
  if (!url) return false;
  if (url.startsWith("/uploads/")) return true;
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".public.blob.vercel-storage.com") || host.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function storeUpload(file: File, folder: string, prefix: string) {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const cleanBase = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const filename = `${prefix}_${cleanBase || "file"}_${safeFilename(file.name)}`;

  if (BLOB_TOKEN) {
    const blob = await put(`${folder}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
      token: BLOB_TOKEN,
    });
    return blob.url;
  }

  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${filename}`;
}

export async function deleteUpload(url: string | null | undefined) {
  if (!url) return;
  if (url.startsWith("/uploads/")) {
    try {
      await unlink(join(process.cwd(), "public", url));
    } catch {
      // ignore missing local file
    }
    return;
  }
  if (BLOB_TOKEN && isManagedUploadUrl(url)) {
    try {
      await del(url, { token: BLOB_TOKEN });
    } catch {
      // ignore missing blob
    }
  }
}
