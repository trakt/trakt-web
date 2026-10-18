import type { Plugin } from 'vite';

type RedirectParaglideParams = {
  from: string;
  to: string;
};

export function redirectParaglide({
  from,
  to,
}: RedirectParaglideParams): Plugin {
  const prefixes = ['$lib/paraglide/', `${from}/`];

  return {
    name: 'trakt:redirect-paraglide',
    enforce: 'pre',
    resolveId(source, importer, options) {
      const prefix = prefixes.find((candidate) => source.startsWith(candidate));
      if (!prefix) {
        return null;
      }

      return this.resolve(`${to}/${source.slice(prefix.length)}`, importer, {
        ...options,
        skipSelf: true,
      });
    },
  };
}
