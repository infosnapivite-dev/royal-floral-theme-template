const sharp = require('sharp');
const path = require('path');

async function makePerfectBase() {
  const assetsDir = path.resolve(__dirname, '../src/assets');
  const baseFrame = path.join(assetsDir, 'book-full-frame.webp');

  const { data, info } = await sharp(baseFrame)
    .raw()
    .toBuffer({ resolveWithObject: true });

  function getPaperColorAtY(y) {
    let rSum = 0, gSum = 0, bSum = 0;
    const count = 15;
    for (let x = 60; x < 60 + count; x++) {
      const idx = (y * info.width + x) * info.channels;
      rSum += data[idx];
      gSum += data[idx + 1];
      bSum += data[idx + 2];
    }
    return [rSum / count, gSum / count, bSum / count];
  }

  // Clear text from y = 730 to 830, x = 100 to 450 smoothly
  for (let y = 730; y <= 830; y++) {
    const [rRow, gRow, bRow] = getPaperColorAtY(y);
    // Dynamic right boundary to curve smoothly around the leaf/flower
    const maxX = y > 765 ? Math.max(380, 480 - (y - 765) * 1.8) : 460;
    for (let x = 100; x <= maxX; x++) {
      const idx = (y * info.width + x) * info.channels;
      const grain = ((x * 17 + y * 23) % 5) - 2;

      data[idx] = Math.round(Math.min(255, Math.max(0, rRow + grain)));
      data[idx + 1] = Math.round(Math.min(255, Math.max(0, gRow + grain)));
      data[idx + 2] = Math.round(Math.min(255, Math.max(0, bRow + grain)));
    }
  }

  // Clear photo area y = 158 to 726, x = 86 to 556
  for (let y = 158; y <= 728; y++) {
    const [rRow, gRow, bRow] = getPaperColorAtY(y);
    for (let x = 86; x <= 556; x++) {
      const idx = (y * info.width + x) * info.channels;
      const grain = ((x * 13 + y * 19) % 5) - 2;

      data[idx] = Math.round(Math.min(255, Math.max(0, rRow + grain)));
      data[idx + 1] = Math.round(Math.min(255, Math.max(0, gRow + grain)));
      data[idx + 2] = Math.round(Math.min(255, Math.max(0, bRow + grain)));
    }
  }

  await sharp(data, { raw: info })
    .webp({ quality: 95 })
    .toFile(path.join(assetsDir, 'book-clean-base.webp'));

  console.log('Seamless book-clean-base.webp regenerated!');
}

makePerfectBase().catch(console.error);
