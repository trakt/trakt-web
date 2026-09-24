async function toWasmModule(
  loaded: { default?: unknown },
): Promise<WebAssembly.Module> {
  return await (loaded.default ?? loaded) as WebAssembly.Module;
}

export function loadEdgeShareWasm() {
  return import('@takumi-rs/wasm/takumi_wasm_bg.wasm?module').then(
    toWasmModule,
  );
}
