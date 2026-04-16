type CssSupports = (query: string) => boolean;

type CssFeature = {
  label: string;
  query: string;
};

const REQUIRED_CSS_FEATURES: ReadonlyArray<CssFeature> = [
  { label: ':has() selectors', query: 'selector(:has(*))' },
  {
    label: 'color-mix() colors',
    query: 'color: color-mix(in srgb, black 50%, transparent)',
  },
  { label: 'overflow: clip', query: 'overflow: clip' },
];

type GetUnsupportedCssFeaturesParams = {
  cssSupports?: CssSupports | null;
};

const getDefaultCssSupports = (): CssSupports | undefined => {
  const supports = globalThis.CSS?.supports;
  return supports?.bind(globalThis.CSS);
};

const isFeatureSupported = (
  cssSupports: CssSupports,
  query: string,
): boolean => {
  try {
    return cssSupports(query);
  } catch {
    return false;
  }
};

export function getUnsupportedCssFeatures(
  { cssSupports = getDefaultCssSupports() }: GetUnsupportedCssFeaturesParams = {},
): ReadonlyArray<string> {
  if (!cssSupports) {
    return REQUIRED_CSS_FEATURES.map(({ label }) => label);
  }

  return REQUIRED_CSS_FEATURES
    .filter(({ query }) => !isFeatureSupported(cssSupports, query))
    .map(({ label }) => label);
}
