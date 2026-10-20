import { chromium, type Browser, type Page } from 'playwright';
import { join } from 'node:path';

const BASE_URL = process.env.PWA_SCREENSHOTS_BASE_URL ?? 'https://app.trakt.tv';
const TOKEN = process.env.TRAKT_PWA_SCREENSHOTS_TOKEN;
const OUT_DIR = join(import.meta.dir, '../static/pwa/screenshots');
const SETTLE_MS = 3000;
const SCALE = 2;

type Shot = {
  readonly name: string;
  readonly path: string;
  readonly signedIn: boolean;
};

const SHOTS: readonly Shot[] = [
  { name: '1_welcome', path: '/', signedIn: false },
  { name: '2_shows', path: '/shows', signedIn: true },
  { name: '3_show', path: '/shows/it-welcome-to-derry', signedIn: true },
  { name: '4_movies', path: '/movies', signedIn: true },
  { name: '5_movie', path: '/movies/f1-2025', signedIn: true },
];

const FORM_FACTORS = [
  { prefix: '', viewport: { width: 390, height: 870 }, isMobile: true },
  { prefix: 'wide_', viewport: { width: 984, height: 722 }, isMobile: false },
] as const;

function fileName(shot: Shot, prefix: string): string {
  const [index, ...rest] = shot.name.split('_');
  return `${index}_${prefix}${rest.join('_')}.webp`;
}

function sessionFor(token: string): string {
  return JSON.stringify({
    access_token: token,
    token_type: 'Bearer',
    scope: 'public openid profile email',
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    profile: { sub: 'pwa-screenshots' },
  });
}

function answerOidcSession(session: string) {
  const read = Storage.prototype.getItem;
  Storage.prototype.getItem = function (key: string) {
    return key.startsWith('oidc.user:') && read.call(this, key) == null
      ? session
      : read.call(this, key);
  };
}

async function capture(page: Page, path: string, file: string) {
  await page.goto(new URL(path, BASE_URL).toString(), {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(SETTLE_MS);

  const cdp = await page.context().newCDPSession(page);
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'webp',
    quality: 82,
  });
  await Bun.write(join(OUT_DIR, file), Buffer.from(data, 'base64'));
  console.log(`wrote ${file}`);
}

async function run(browser: Browser, token: string) {
  for (const formFactor of FORM_FACTORS) {
    for (const shot of SHOTS) {
      const context = await browser.newContext({
        viewport: formFactor.viewport,
        deviceScaleFactor: SCALE,
        isMobile: formFactor.isMobile,
        hasTouch: formFactor.isMobile,
        colorScheme: 'dark',
      });

      if (shot.signedIn) {
        await context.addInitScript(answerOidcSession, sessionFor(token));
      }

      const page = await context.newPage();
      await capture(page, shot.path, fileName(shot, formFactor.prefix));
      await context.close();
    }
  }
}

if (!TOKEN) {
  console.error(
    'TRAKT_PWA_SCREENSHOTS_TOKEN is required: an access token for the test account.',
  );
  process.exit(1);
}

const browser = await chromium.launch({
  args: [`--force-device-scale-factor=${SCALE}`],
});
try {
  await run(browser, TOKEN);
} finally {
  await browser.close();
}
