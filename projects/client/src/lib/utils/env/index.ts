const IS_DEV = TRAKT_MODE.startsWith('development');
const IS_PROD = TRAKT_MODE.startsWith('production');
const IS_TEST = TRAKT_MODE.startsWith('test');
const IS_PREVIEW = TRAKT_MODE.endsWith('preview');

export { IS_DEV, IS_PREVIEW, IS_PROD, IS_TEST };
