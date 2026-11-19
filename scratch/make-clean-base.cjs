const sharp = require('sharp');
const path = require('path');

async function makeCleanBase() {
  const assetsDir = path.resolve(__dirname, '../src/assets');
  const baseFrame = path.join(assetsDir, 'book-full-frame.webp');

  const { data, info } = await sharp(baseFrame)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Source clean paper area: x from 200 to 280, y from 135 to 153 (clean paper above photos)
  const patchW = 80;
  const patchH = 18;

  // Fill x: 84 to 558, y: 160 to 780 with seamless paper texture
  for (let y = 160; y <= 780; y++) {
    for (let x = 84; x <= 558; x++) {
      // Semi-randomized sampling from clean paper to avoid visible repeating patterns
      const sampleX = 200 + ((x * 13 + y * 7) % patchW);
      const sampleY = 135 + ((y * 11 + x * 5) % patchH);

      const srcIdx = (sampleY * info.width + sampleX) * info.channels;
      const dstIdx = (y * info.width + x) * info.channels;

      data[dstIdx] = data[srcIdx];
      data[dstIdx + 1] = data[srcIdx + 1];
      data[dstIdx + 2] = data[srcIdx + 2];
    }
  }

  // Smooth the boundary edges of the filled rectangle slightly with a gentle box blur on the interior
  await sharp(data, { raw: info })
    .webp({ quality: 95 })
    .toFile(path.join(assetsDir, 'book-clean-base.webp'));

  console.log('book-clean-base.webp successfully generated!');
}

makeCleanBase().catch(console.error);
