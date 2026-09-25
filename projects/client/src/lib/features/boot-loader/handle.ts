import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';
import type { Handle } from '@sveltejs/kit';
import bootLoaderTemplate from './_internal/bootLoader.html?raw';

export const BOOT_LOADER_PLACEHOLDER = '%boot.loader%';

const STYLESHEET_LINK = /<link href="([^"]+)" rel="stylesheet">/g;

function toBootStylesheet(href: string) {
  return `<link href="${href}" rel="stylesheet" data-boot-css onerror="this.dataset.bootFailed=''">`;
}

function renderBootLoader({ html, scriptCount }: {
  html: string;
  scriptCount: number;
}) {
  const hrefs = Array.from(html.matchAll(STYLESHEET_LINK), ([, href]) => href);

  if (hrefs.length === 0) {
    return html.replace(BOOT_LOADER_PLACEHOLDER, '');
  }

  const loader = bootLoaderTemplate
    .replace('%boot.css%', `${hrefs.length}`)
    .replace('%boot.js%', `${scriptCount}`);
  const stylesheets = hrefs.map(toBootStylesheet).join('');

  return html
    .replace(STYLESHEET_LINK, '')
    .replace(BOOT_LOADER_PLACEHOLDER, `${loader}${stylesheets}`);
}

export const handle: Handle = ({ event, resolve }) => {
  const agent = event.request.headers.get('user-agent');

  if (event.locals.isLegitimateBot || isBotAgent(agent)) {
    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html.replace(BOOT_LOADER_PLACEHOLDER, ''),
    });
  }

  const scripts = new Set<string>();

  return resolve(event, {
    preload: ({ type, path }) => {
      if (type === 'js') scripts.add(path);
      return type === 'js' || type === 'css';
    },
    transformPageChunk: ({ html }) =>
      renderBootLoader({ html, scriptCount: scripts.size }),
  });
};
