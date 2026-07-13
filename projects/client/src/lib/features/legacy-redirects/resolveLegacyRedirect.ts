import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

/**
 * Maps a legacy trakt.tv (v2) path to its canonical trakt-web equivalent.
 *
 * The v2 site is being retired and every legacy `trakt.tv/*` path now lands
 * on trakt-web. Many legacy shapes differ from trakt-web's routes (singular
 * `show/:id`, chart pages like `shows/played`, sub-routes like
 * `shows/:id/comments`) and would 404. Each rule rewrites one such shape to the
 * closest sensible trakt-web page.
 *
 * Returns the canonical path (with any query params the target itself needs),
 * or `null` when the path already maps natively and should pass through
 * untouched. Pure: same input -> same output, no side effects.
 */

type LegacyRule = {
  readonly pattern: RegExp;
  readonly to: (match: RegExpMatchArray) => string;
};

// Chart words backed by a trakt-web discover page: mapped to the canonical
// `/discover/:word?mode=:type` URL.
const discoverBuilders = {
  trending: UrlBuilder.trending,
  popular: UrlBuilder.popular,
  anticipated: UrlBuilder.anticipated,
  recommended: UrlBuilder.recommended,
  releases: UrlBuilder.releases,
} as const;
const discoverChartWords = Object.keys(discoverBuilders).join('|');

// Chart/collection words with no discover drilldown -> discover, mode-filtered.
// A media slug never collides with these (v2 reserved them), so this is safe.
const indexChartWords =
  'played|watched|collected|favorited|streaming|hot|library|boxoffice';

// Sub-route leaves that have no trakt-web page and fold back to their parent.
const showSubroutes = 'comments|credits|stats|history|progress|ratings|people';
const movieSubroutes = 'comments|credits|releases|stats|history|people';
const seasonSubroutes = 'comments|credits|stats|wikipedia|lists|people';
const episodeSubroutes = 'comments|credits|stats|wikipedia|lists|people';

// User sub-routes whose content lives in the profile activity drawer.
const userActivitySubroutes = 'ratings|comments';
// Remaining user sub-routes with no dedicated trakt-web page -> profile home.
const userToProfileSubroutes = 'notes|likes|reactions|charts|network';

const episodeDrawer = (m: RegExpMatchArray): string =>
  UrlBuilder.episodeDrawer(m[1], Number(m[2]), Number(m[3]));

const seasonDrawer = (m: RegExpMatchArray): string =>
  UrlBuilder.seasonDrawer(m[1], Number(m[2]));

const rules: ReadonlyArray<LegacyRule> = [
  // --- A. Media: structural rename (singular -> plural / segment rename) ---
  // Episode (drawer format) must precede the shorter show/season rules.
  {
    pattern: /^\/show\/([^/]+)\/season\/([^/]+)\/episode\/([^/]+)\/?$/,
    to: episodeDrawer,
  },
  {
    pattern: /^\/show\/([^/]+)\/season\/([^/]+)\/?$/,
    to: seasonDrawer,
  },
  {
    pattern: /^\/show\/([^/]+)\/?$/,
    to: (m) => UrlBuilder.show(m[1]),
  },
  {
    pattern: /^\/movie\/([^/]+)\/?$/,
    to: (m) => UrlBuilder.movie(m[1]),
  },
  {
    pattern: /^\/user\/([^/]+)\/?$/,
    to: (m) => `/users/${m[1]}`,
  },

  // --- C. Chart/collection index pages (would otherwise hit [slug]) ---
  // Discover-backed charts -> canonical /discover/:word?mode=:type.
  {
    pattern: new RegExp(`^\\/shows\\/(${discoverChartWords})\\/?$`),
    to: (m) =>
      discoverBuilders[m[1] as keyof typeof discoverBuilders]({
        mode: 'show',
      }),
  },
  {
    pattern: new RegExp(`^\\/movies\\/(${discoverChartWords})\\/?$`),
    to: (m) =>
      discoverBuilders[m[1] as keyof typeof discoverBuilders]({
        mode: 'movie',
      }),
  },
  // Charts with no discover drilldown -> discover, filtered by mode.
  {
    pattern: new RegExp(`^\\/shows\\/(?:${indexChartWords})\\/?$`),
    to: () => UrlBuilder.discover({ mode: 'show' }),
  },
  {
    pattern: new RegExp(`^\\/movies\\/(?:${indexChartWords})\\/?$`),
    to: () => UrlBuilder.discover({ mode: 'movie' }),
  },
  // Bare media index -> discover, filtered by mode.
  {
    pattern: /^\/shows\/?$/,
    to: () => UrlBuilder.discover({ mode: 'show' }),
  },
  {
    pattern: /^\/movies\/?$/,
    to: () => UrlBuilder.discover({ mode: 'movie' }),
  },

  // --- B. Media sub-routes with no trakt-web page -> nearest parent ---
  // Episode sub-routes -> episode drawer.
  {
    pattern: new RegExp(
      `^\\/shows\\/([^/]+)\\/seasons\\/([^/]+)\\/episodes\\/([^/]+)\\/(?:${episodeSubroutes})\\/?$`,
    ),
    to: episodeDrawer,
  },
  // Season sub-routes -> season drawer.
  {
    pattern: new RegExp(
      `^\\/shows\\/([^/]+)\\/seasons\\/([^/]+)\\/(?:${seasonSubroutes})\\/?$`,
    ),
    to: seasonDrawer,
  },
  // `seasons/all` overview -> seasons drawer, defaulting to the first season
  // (the drawer requires a season number).
  {
    pattern: /^\/shows\/([^/]+)\/seasons\/all\/?$/,
    to: (m) => UrlBuilder.seasonDrawer(m[1], 1),
  },
  // Show sub-routes -> show page.
  {
    pattern: new RegExp(`^\\/shows\\/([^/]+)\\/(?:${showSubroutes})\\/?$`),
    to: (m) => UrlBuilder.show(m[1]),
  },
  // Movie sub-routes -> movie page.
  {
    pattern: new RegExp(`^\\/movies\\/([^/]+)\\/(?:${movieSubroutes})\\/?$`),
    to: (m) => UrlBuilder.movie(m[1]),
  },

  // --- D. User profile sub-routes (v2 /users/:id/*) ---
  {
    pattern: /^\/users\/([^/]+)\/history\/?$/,
    to: (m) => UrlBuilder.profile.history(m[1]),
  },
  {
    pattern: /^\/users\/([^/]+)\/favorites\/?$/,
    to: (m) => UrlBuilder.profile.favorites(m[1]),
  },
  // Hidden items are private to the owner and surface on their own progress
  // page, so point at the signed-in user's media progress.
  {
    pattern: /^\/users\/[^/]+\/hidden(?:\/.*)?$/,
    to: () => UrlBuilder.profile.progress('me', { mode: 'media' }),
  },
  // Ratings / comments live in the profile activity drawer.
  {
    pattern: new RegExp(
      `^\\/users\\/([^/]+)\\/(?:${userActivitySubroutes})(?:\\/.*)?$`,
    ),
    to: (m) => `${UrlBuilder.profile.user(m[1])}?view=activity`,
  },
  // Numeric-id user list -> user's lists overview (slug can't be reconstructed).
  {
    pattern: /^\/users\/([^/]+)\/lists\/\d+\/?$/,
    to: (m) => UrlBuilder.lists.user(m[1]),
  },
  {
    pattern: new RegExp(
      `^\\/users\\/([^/]+)\\/(?:${userToProfileSubroutes})(?:\\/.*)?$`,
    ),
    to: (m) => UrlBuilder.profile.user(m[1]),
  },

  // --- E. People sub-routes with no trakt-web page -> person page ---
  {
    pattern: /^\/people\/([^/]+)\/lists\/?$/,
    to: (m) => UrlBuilder.people(m[1]),
  },

  // --- Top-level pages ---
  {
    pattern: /^\/dashboard(?:\/.*)?$/,
    to: () => UrlBuilder.home(),
  },
  {
    pattern: /^\/officiallist\/([^/]+)\/?$/,
    to: (m) => `/lists/official/${m[1]}`,
  },

  // --- No sensible target -> nearest-section fallback (home) ---
  // Bare `/seasons/:id` and `/episodes/:id` are v2 API endpoints with no show
  // context to anchor a drawer on, so there is no equivalent page; send them to
  // home rather than 404.
  {
    pattern: /^\/seasons\/[^/]+\/?$/,
    to: () => UrlBuilder.home(),
  },
  {
    pattern: /^\/episodes\/[^/]+\/?$/,
    to: () => UrlBuilder.home(),
  },
  // Numeric-id public list / watchlist: slug can't be reconstructed, so fall
  // back to the signed-in user's lists landing (holds the watchlist and every
  // other list).
  {
    pattern: /^\/(?:lists|watchlist)\/\d+\/?$/,
    to: () => UrlBuilder.lists.user('me'),
  },
  {
    pattern: /^\/comments\/[^/]+\/[^/]+\/?$/,
    to: () => UrlBuilder.home(),
  },
  {
    pattern: /^\/share\/[^/]+\/?$/,
    to: () => UrlBuilder.home(),
  },
  {
    pattern: /^\/tmdb(?:\/.*)?$/,
    to: () => UrlBuilder.home(),
  },
];

export function resolveLegacyRedirect(pathname: string): string | null {
  const rule = rules.find(({ pattern }) => pattern.test(pathname));
  if (!rule) {
    return null;
  }

  const match = pathname.match(rule.pattern);
  if (!match) {
    return null;
  }

  return rule.to(match);
}
