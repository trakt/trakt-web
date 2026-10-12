import cloudsUrl from './assets/halloween-clouds.webp';
import fogUrl from './assets/halloween-fog.webp';
import graveyardLargeUrl from './assets/halloween-graveyard-2x.webp';
import graveyardUrl from './assets/halloween-graveyard.webp';
import hillLargeUrl from './assets/halloween-hill-2x.webp';
import hillUrl from './assets/halloween-hill.webp';
import moonUrl from './assets/halloween-moon.webp';

function decodeImage(src: string): Promise<void> {
  const image = new Image();
  image.src = src;
  return image.decode().catch(() => undefined);
}

export function preloadHalloweenAssets(): Promise<void> {
  const isHighDensity = globalThis.devicePixelRatio > 1;
  const sources = [
    moonUrl,
    cloudsUrl,
    fogUrl,
    isHighDensity ? hillLargeUrl : hillUrl,
    isHighDensity ? graveyardLargeUrl : graveyardUrl,
  ];

  return Promise.all(sources.map(decodeImage)).then(() => undefined);
}
