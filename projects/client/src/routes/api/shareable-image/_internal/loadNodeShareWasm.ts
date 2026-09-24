import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

export async function loadNodeShareWasm() {
  const require = createRequire(import.meta.url);
  const wasm = await readFile(
    require.resolve('@takumi-rs/wasm/takumi_wasm_bg.wasm'),
  );

  return new WebAssembly.Module(wasm);
}
