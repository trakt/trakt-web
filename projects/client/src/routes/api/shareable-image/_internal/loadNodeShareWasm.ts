import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

export async function loadNodeShareWasm() {
  const require = createRequire(import.meta.url);

  const [resvg, jpeg] = await Promise.all([
    readFile(require.resolve('@resvg/resvg-wasm/index_bg.wasm')),
    readFile(require.resolve('@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm')),
  ]);

  return {
    resvg: new WebAssembly.Module(resvg),
    jpeg: new WebAssembly.Module(jpeg),
  };
}
