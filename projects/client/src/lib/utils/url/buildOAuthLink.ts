import { Environment } from '$lib/api.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export type BuildOAuthUrlParams = {
  local: Environment;
  target: Environment;
};

export function buildOAuthUrl(clientId: string, origin: string) {
  const env = prependHttps(
    TRAKT_TARGET_ENVIRONMENT
      .replace('api.', '')
      .replace('apiz.', ''),
  );

  return `${env}/oauth/authorize?client_id=${clientId}&redirect_uri=${origin}&response_type=code&hide_email_form=true`;
}
