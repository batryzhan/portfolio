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

// Project screenshots for the Projects carousels: every image in
// assets/projects/<project>/ becomes <name>-960.webp and <name>-1600.webp in
// public/images/projects/<project>/ (used as srcset pairs).
import { readdir } from "node:fs/promises";

const PROJECTS_SRC = "assets/projects";
const PROJECTS_OUT = "public/images/projects";
for (const project of await readdir(PROJECTS_SRC)) {
  await mkdir(`${PROJECTS_OUT}/${project}`, { recursive: true });
  for (const file of (await readdir(`${PROJECTS_SRC}/${project}`)).sort()) {
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    const name = file.replace(/\.[^.]+$/, "");
    for (const width of [960, 1600]) {
      const info = await sharp(`${PROJECTS_SRC}/${project}/${file}`)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(`${PROJECTS_OUT}/${project}/${name}-${width}.webp`);
      console.log(`${project}/${name}-${width}.webp: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
    }
  }
}
