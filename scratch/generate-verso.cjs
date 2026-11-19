const sharp = require('sharp');
const path = require('path');

async function createVerso() {
  const assetsDir = path.resolve(__dirname, '../src/assets');
  const baseFrame = path.join(assetsDir, 'book-full-frame.webp');

  // Flop base frame so spine is on the right
  const flopped = await sharp(baseFrame).flop().toBuffer();

  // Extract pure clean parchment patch
  const cleanPaper = await sharp(baseFrame)
    .extract({ left: 200, top: 135, width: 80, height: 18 })
    .toBuffer();

  // Resize patch to cover the whole center content area (x: 80 to 555, y: 50 to 800)
  const fullPatch = await sharp(cleanPaper)
    .resize(480, 760, { fit: 'fill' })
    .toBuffer();

  // Romantic calligraphy text SVG for the verso leaf
  const versoSvg = `
    <svg width="480" height="760" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Playfair+Display:ital,wght@0,400;1,400&amp;display=swap');
          .quote { font-family: 'Great Vibes', cursive; font-size: 34px; fill: #6e474c; text-anchor: middle; }
          .author { font-family: 'Playfair Display', Georgia, serif; font-size: 13px; fill: #8a7d76; letter-spacing: 2px; text-anchor: middle; text-transform: uppercase; }
          .monogram { font-family: 'Cinzel', serif; font-size: 26px; fill: #c5a059; text-anchor: middle; font-weight: normal; }
        </style>
      </defs>

      <!-- Delicate Monogram Crest -->
      <circle cx="240" cy="280" r="32" fill="none" stroke="#c5a059" stroke-width="1.2" stroke-opacity="0.6"/>
      <circle cx="240" cy="280" r="28" fill="none" stroke="#c5a059" stroke-width="0.8" stroke-dasharray="2 2" stroke-opacity="0.4"/>
      <text x="240" y="288" class="monogram">E &amp; T</text>

      <!-- Romantic Verse -->
      <text x="240" y="380" class="quote">“Every love story is beautiful,</text>
      <text x="240" y="425" class="quote">but ours is my favorite.”</text>

      <line x1="190" y1="460" x2="290" y2="460" stroke="#c59a94" stroke-width="1.2" stroke-opacity="0.8"/>
      <text x="240" y="495" class="author">Château de Versailles</text>
    </svg>
  `;
  const textBuf = Buffer.from(versoSvg);

  await sharp(flopped)
    .composite([
      { input: fullPatch, top: 44, left: 80 },
      { input: textBuf, top: 44, left: 80 }
    ])
    .webp({ quality: 94 })
    .toFile(path.join(assetsDir, 'book-page-verso.webp'));

  console.log('Clean romantic verso page created!');
}

createVerso().catch(console.error);
