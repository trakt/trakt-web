import { registerHooks } from 'node:module';

const LIB_ALIAS = '$lib/';
const LIB_DIR = new URL('../src/lib/', import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith(LIB_ALIAS)) {
      return nextResolve(specifier, context);
    }

    return nextResolve(
      new URL(specifier.slice(LIB_ALIAS.length), LIB_DIR).href,
      context,
    );
  },
});
