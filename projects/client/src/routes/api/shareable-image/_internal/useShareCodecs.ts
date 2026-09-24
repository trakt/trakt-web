import encodeJpeg, { init as initJpeg } from '@jsquash/jpeg/encode';
import { initWasm, Resvg } from '@resvg/resvg-wasm';

type ShareCodecs = {
  Resvg: typeof Resvg;
  encodeJpeg: typeof encodeJpeg;
};

function isWorkerRuntime(): boolean {
  return typeof navigator !== 'undefined' &&
    navigator.userAgent === 'Cloudflare-Workers';
}

async function loadShareWasm() {
  if (isWorkerRuntime()) {
    const { loadEdgeShareWasm } = await import('./loadEdgeShareWasm.ts');
    return loadEdgeShareWasm();
  }

  const { loadNodeShareWasm } = await import('./loadNodeShareWasm.ts');
  return loadNodeShareWasm();
}

async function initShareCodecs(): Promise<ShareCodecs> {
  const wasm = await loadShareWasm();

  await Promise.all([initWasm(wasm.resvg), initJpeg(wasm.jpeg)]);

  return { Resvg, encodeJpeg };
}

let codecs: Promise<ShareCodecs> | undefined;

export function useShareCodecs(): Promise<ShareCodecs> {
  codecs ??= initShareCodecs().catch((e: unknown) => {
    codecs = undefined;
    throw e;
  });

  return codecs;
}
