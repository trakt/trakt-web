async function toWasmModule(
  loaded: { default?: unknown },
): Promise<WebAssembly.Module> {
  return await (loaded.default ?? loaded) as WebAssembly.Module;
}

export async function loadEdgeShareWasm() {
  const [resvg, jpeg] = await Promise.all([
    import('@resvg/resvg-wasm/index_bg.wasm?module').then(toWasmModule),
    import('@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm?module').then(
      toWasmModule,
    ),
  ]);

  return { resvg, jpeg };
}
