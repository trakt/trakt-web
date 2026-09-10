type BuildRobotsTxtParams = {
  disallowedPaths: readonly string[];
  blockedParams: readonly string[];
  sitemapUrl: string;
};

export function buildRobotsTxt({
  disallowedPaths,
  blockedParams,
  sitemapUrl,
}: BuildRobotsTxtParams): string {
  const pathRules = disallowedPaths.map((path) => `Disallow: ${path}`);
  const paramRules = blockedParams.map((param) => `Disallow: /*?*${param}=`);

  return [
    'User-agent: *',
    'Allow: /',
    ...pathRules,
    '',
    ...paramRules,
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
}
