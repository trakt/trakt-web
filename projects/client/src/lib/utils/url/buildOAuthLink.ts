import { type Environment } from '@trakt/api';
import { prependHttps } from './prependHttps.ts';

export type BuildOAuthUrlParams = {
  local: Environment;
  target: Environment;
};

export function buildOAuthUrl(clientId: string, origin: string) {
  const env = prependHttps(
    TRAKT_TARGET_ENVIRONMENT
      .replace('api.', '')
      .replace('apiz.', '')
      .replace('hd.', ''),
  );

  return `${env}/oauth/authorize?client_id=${clientId}&redirect_uri=${origin}&response_type=code&hide_email_form=true`;
}
