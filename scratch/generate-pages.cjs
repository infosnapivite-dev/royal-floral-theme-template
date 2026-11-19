const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateCleanPages() {
  const assetsDir = path.resolve(__dirname, '../src/assets');
  const baseFrame = path.join(assetsDir, 'book-full-frame.webp');

  // Extract pure clean paper texture with natural parchment grain from (200, 135)
  const cleanPaper = await sharp(baseFrame)
    .extract({ left: 200, top: 135, width: 80, height: 18 })
    .toBuffer();

  // Resize patch to cover x: 88 to 555 (width: 467px) and y: 692 to 812 (height: 120px)
  const paperPatch = await sharp(cleanPaper)
    .resize(467, 120, { fit: 'fill' })
    .toBuffer();

  // Helper to trim and resize photos
  async function getPhoto(fileName, targetW, targetH) {
    const filePath = path.join(assetsDir, fileName);
    let img = sharp(filePath);
    const meta = await img.metadata();

    if (fileName === 'gallery-photo-sub1.webp' || fileName === 'gallery-photo-sub2.webp' || fileName === 'gallery-walking.webp') {
      img = img.extract({
        left: 0,
        top: 12,
        width: meta.width,
        height: meta.height - 12
      });
    }

    return await img.resize(targetW, targetH, { fit: 'cover' }).toBuffer();
  }

  const pagesConfig = [
    {
      num: '01',
      caption: 'Where our story began',
      top: 'gallery-portrait.webp',
      sub1: 'gallery-bouquet.webp',
      sub2: 'gallery-photo-sub2.webp'
    },
    {
      num: '02',
      isOriginal: true // Untouched original from reference
    },
    {
      num: '03',
      caption: 'Strolling hand in hand',
      top: 'gallery-portrait.webp',
      sub1: 'gallery-walking.webp',
      sub2: 'gallery-photo-sub1.webp'
    },
    {
      num: '04',
      caption: 'A love in full bloom',
      top: 'gallery-photo-main.webp',
      sub1: 'gallery-bouquet.webp',
      sub2: 'gallery-photo-sub1.webp'
    },
    {
      num: '05',
      caption: 'Laughter in the rose garden',
      top: 'gallery-portrait.webp',
      sub1: 'gallery-chateau-view.webp',
      sub2: 'gallery-walking.webp'
    },
    {
      num: '06',
      caption: 'Château garden romance',
      top: 'gallery-photo-main.webp',
      sub1: 'gallery-chateau-view.webp',
      sub2: 'gallery-photo-sub2.webp'
    },
    {
      num: '07',
      caption: 'Two hearts, one journey',
      top: 'gallery-portrait.webp',
      sub1: 'gallery-bouquet.webp',
      sub2: 'gallery-walking.webp'
    },
    {
      num: '08',
      caption: 'Cherished for all eternity',
      top: 'gallery-photo-main.webp',
      sub1: 'gallery-photo-sub1.webp',
      sub2: 'gallery-photo-sub2.webp'
    }
  ];

  for (const page of pagesConfig) {
    const outFile = path.join(assetsDir, `book-page-${page.num}.webp`);

    if (page.isOriginal) {
      fs.copyFileSync(baseFrame, outFile);
      console.log(`Page 02 preserved from original -> ${outFile}`);
      continue;
    }

    const topBuf = await getPhoto(page.top, 467, 388);
    const sub1Buf = await getPhoto(page.sub1, 230, 140);
    const sub2Buf = await getPhoto(page.sub2, 227, 140);

    const textSvg = `
      <svg width="467" height="120" xmlns="http://www.w3.org/2000/svg">
        <text x="233" y="32" font-family="Cinzel, 'Playfair Display', Georgia, serif" font-size="21" fill="#4a3b32" text-anchor="middle" font-weight="normal" letter-spacing="0.5">${page.caption}</text>
        <text x="233" y="82" font-family="'Playfair Display', Georgia, serif" font-size="14" fill="#8a7d76" text-anchor="middle" letter-spacing="1">${page.num}</text>
      </svg>
    `;
    const textBuf = Buffer.from(textSvg);

    await sharp(baseFrame)
      .composite([
        { input: topBuf, top: 158, left: 88 },
        { input: sub1Buf, top: 556, left: 88 },
        { input: sub2Buf, top: 556, left: 328 },
        { input: paperPatch, top: 692, left: 88 },
        { input: textBuf, top: 692, left: 88 }
      ])
      .webp({ quality: 94 })
      .toFile(outFile);

    console.log(`Generated page ${page.num} -> ${outFile}`);
  }
}

generateCleanPages().catch(console.error);
