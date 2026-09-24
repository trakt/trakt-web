import { initSync, Renderer } from '@takumi-rs/wasm';

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

async function initShareRenderer(): Promise<Renderer> {
  initSync({ module: await loadShareWasm() });

  return new Renderer();
}

let renderer: Promise<Renderer> | undefined;

export function useShareRenderer(): Promise<Renderer> {
  renderer ??= initShareRenderer().catch((e: unknown) => {
    renderer = undefined;
    throw e;
  });

  return renderer;
}
