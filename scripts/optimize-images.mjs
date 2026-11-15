// Converts the source photos in assets/img into web-sized WebP files in public/img.
// Run with: node scripts/optimize-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets/img";
const OUT = "public/img";

const jobs = [
  { from: "photo_2026-11-15_15-20-43.jpg", to: "portrait.webp", width: 800 },
  { from: "photo_2026-11-15_15-20-44.jpg", to: "decentrathon.webp", width: 1280 },
  { from: "photo_2026-11-15_15-20-45.jpg", to: "first-championship.webp", width: 1280 },
  { from: "photo_2026-11-15_15-20-45 (2).jpg", to: "wro-national.webp", width: 1280 },
  { from: "photo_2026-11-15_15-20-46.jpg", to: "cp-open-cup.webp", width: 1280 },
  { from: "image_93104a.png", to: "lyceum.webp", width: 240 },
];

await mkdir(OUT, { recursive: true });
for (const job of jobs) {
  const info = await sharp(`${SRC}/${job.from}`)
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`${OUT}/${job.to}`);
  console.log(`${job.to}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
}
