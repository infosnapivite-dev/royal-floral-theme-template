const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function removeRibbon() {
  const assetsDir = path.resolve(__dirname, '../src/assets');

  // 1. Remove ribbon from book-clean-base.webp
  const cleanBaseFile = path.join(assetsDir, 'book-clean-base.webp');
  const baseBuf = fs.readFileSync(cleanBaseFile);
  const { data: baseData, info: baseInfo } = await sharp(baseBuf)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y <= 56; y++) {
    for (let x = 486; x <= 542; x++) {
      const srcX = x - 64;
      const srcIdx = (y * baseInfo.width + srcX) * baseInfo.channels;
      const dstIdx = (y * baseInfo.width + x) * baseInfo.channels;

      baseData[dstIdx] = baseData[srcIdx];
      baseData[dstIdx + 1] = baseData[srcIdx + 1];
      baseData[dstIdx + 2] = baseData[srcIdx + 2];
    }
  }

  const outBaseBuf = await sharp(baseData, { raw: baseInfo })
    .webp({ quality: 96 })
    .toBuffer();
  fs.writeFileSync(cleanBaseFile, outBaseBuf);
  console.log('Ribbon successfully removed from book-clean-base.webp');

  // 2. Remove ribbon from book-page-verso.webp
  const versoFile = path.join(assetsDir, 'book-page-verso.webp');
  const versoBuf = fs.readFileSync(versoFile);
  const { data: versoData, info: versoInfo } = await sharp(versoBuf)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y <= 56; y++) {
    for (let x = 96; x <= 156; x++) {
      const srcX = x + 68;
      const srcIdx = (y * versoInfo.width + srcX) * versoInfo.channels;
      const dstIdx = (y * versoInfo.width + x) * versoInfo.channels;

      versoData[dstIdx] = versoData[srcIdx];
      versoData[dstIdx + 1] = versoData[srcIdx + 1];
      versoData[dstIdx + 2] = versoData[srcIdx + 2];
    }
  }

  const outVersoBuf = await sharp(versoData, { raw: versoInfo })
    .webp({ quality: 96 })
    .toBuffer();
  fs.writeFileSync(versoFile, outVersoBuf);
  console.log('Ribbon successfully removed from book-page-verso.webp');
}

removeRibbon().catch(console.error);
