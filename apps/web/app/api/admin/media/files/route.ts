import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

type FileInfo = {
  name: string;
  path: string;
  url: string;
  type: "image" | "video";
  size: number;
  folder: string;
};

function getFilesRecursive(dir: string, baseUrl: string, folder: string): FileInfo[] {
  const files: FileInfo[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(path.join(process.cwd(), "public"), fullPath);
    const url = "/" + relativePath.replace(/\\/g, "/");

    if (entry.isDirectory()) {
      files.push(...getFilesRecursive(fullPath, baseUrl, folder + "/" + entry.name));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"].includes(ext);
      const isVideo = [".mp4", ".webm", ".mov", ".avi"].includes(ext);

      if (isImage || isVideo) {
        const stats = fs.statSync(fullPath);
        files.push({
          name: entry.name,
          path: fullPath,
          url,
          type: isVideo ? "video" : "image",
          size: stats.size,
          folder: folder || "root"
        });
      }
    }
  }

  return files;
}

export async function GET() {
  await requireAdmin();

  const publicDir = path.join(process.cwd(), "public");
  const imagesDir = path.join(publicDir, "images");
  const videosDir = path.join(publicDir, "videos");

  const imageFiles = getFilesRecursive(imagesDir, "/images", "images");
  const videoFiles = getFilesRecursive(videosDir, "/videos", "videos");

  const allFiles = [...imageFiles, ...videoFiles].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "video" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const folders = [...new Set(allFiles.map(f => f.folder))].sort();

  return NextResponse.json({
    files: allFiles,
    folders,
    stats: {
      totalImages: imageFiles.length,
      totalVideos: videoFiles.length,
      totalSize: allFiles.reduce((sum, f) => sum + f.size, 0)
    }
  });
}
