export const env = new Proxy({}, {
  get: (_, variableName) => `${String(variableName)}-MOCK`,
});
