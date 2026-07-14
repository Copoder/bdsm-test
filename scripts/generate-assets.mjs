import sharp from "sharp";
import { fileURLToPath } from "node:url";

const path = (relative) => fileURLToPath(new URL(relative, import.meta.url));

await Promise.all([
  sharp(path("../public/og-default.svg"))
    .resize(1200, 630)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path("../public/og-default.png")),
  sharp(path("../public/assets/material-grain.svg"))
    .resize(128, 128)
    .webp({ quality: 24, effort: 6 })
    .toFile(path("../public/assets/material-grain.webp"))
]);

console.log("Generated raster site assets.");
