#!/usr/bin/env node
/* Build the two generated images for the site, using headless Chromium (Playwright):

     og-card.png           1200×630 link-preview card, rendered from scripts/og-card.html
     headshot-circle.webp  336×336 hero photo (2× its 168px display size), from headshot-circle.png

   Run from anywhere:   node scripts/make-images.js
   Needs Playwright:    npm install -g playwright   (or a local install)
   Behind a proxy, set HTTPS_PROXY so the Google Fonts on the card can load. */

const fs = require('fs');
const path = require('path');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const ROOT = path.join(__dirname, '..');
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;

(async () => {
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const page = await browser.newPage({ ignoreHTTPSErrors: !!proxy });

  // 1. Link-preview card
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto('file://' + path.join(__dirname, 'og-card.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fontsOk = await page.evaluate(() => document.fonts.check("600 20px Newsreader"));
  if (!fontsOk) console.warn('Warning: Newsreader did not load; the card will use a fallback serif.');
  await page.locator('.card').screenshot({ path: path.join(ROOT, 'og-card.png') });

  // 2. Smaller hero headshot (WebP keeps the transparent corners)
  const png = fs.readFileSync(path.join(ROOT, 'headshot-circle.png')).toString('base64');
  const webp = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = c.height = 336;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, 336, 336);
    return c.toDataURL('image/webp', 0.92).split(',')[1];
  }, 'data:image/png;base64,' + png);
  fs.writeFileSync(path.join(ROOT, 'headshot-circle.webp'), Buffer.from(webp, 'base64'));

  await browser.close();
  for (const f of ['og-card.png', 'headshot-circle.webp']) {
    console.log(f, Math.round(fs.statSync(path.join(ROOT, f)).size / 1024) + ' KB');
  }
})();
