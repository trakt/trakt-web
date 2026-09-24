declare module '*.wasm?module' {
  const wasmModule: WebAssembly.Module | Promise<WebAssembly.Module>;
  export default wasmModule;
}
