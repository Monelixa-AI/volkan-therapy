import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public/images');
const MAX_WIDTH = 1200;
const QUALITY = 80;

async function optimizeImage(filePath) {
  const stats = fs.statSync(filePath);
  const originalSize = stats.size;

  // Skip if already small (under 200KB)
  if (originalSize < 200 * 1024) {
    console.log(`⏭️  Skipping ${path.basename(filePath)} (already ${(originalSize / 1024).toFixed(0)}KB)`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const tempPath = filePath + '.tmp';

  try {
    let pipeline = sharp(filePath);

    // Get metadata
    const metadata = await pipeline.metadata();

    // Resize if wider than MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    // Convert to WebP for best compression, or optimize PNG/JPG
    if (ext === '.png') {
      await pipeline
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(tempPath);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(tempPath);
    } else if (ext === '.webp') {
      await pipeline
        .webp({ quality: QUALITY })
        .toFile(tempPath);
    }

    const newStats = fs.statSync(tempPath);
    const newSize = newStats.size;

    // Only replace if smaller
    if (newSize < originalSize) {
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      console.log(`✅ ${path.basename(filePath)}: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
    } else {
      fs.unlinkSync(tempPath);
      console.log(`⏭️  Skipping ${path.basename(filePath)} (optimization didn't help)`);
    }
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
  }
}

async function findImages(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findImages(fullPath));
    } else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log('🖼️  Finding images...');
  const images = await findImages(IMAGES_DIR);
  console.log(`Found ${images.length} images\n`);

  let totalOriginal = 0;
  let totalNew = 0;

  for (const image of images) {
    const before = fs.statSync(image).size;
    totalOriginal += before;
    await optimizeImage(image);
    totalNew += fs.statSync(image).size;
  }

  console.log(`\n📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalNew / 1024 / 1024).toFixed(1)}MB`);
}

main().catch(console.error);
