import type { AuthToken } from '../../models/AuthToken';

type ExchangeBody = {
  grant_type: 'authorization_code';
  code: string;
};

type RefreshBody = {
  grant_type: 'refresh_token';
  refresh_token: string;
};

export function getGrantTypeAndCode(
  token: AuthToken,
): ExchangeBody | RefreshBody {
  if (token.type === 'exchange') {
    return {
      grant_type: 'authorization_code',
      code: token.code,
    };
  }

  return {
    grant_type: 'refresh_token',
    refresh_token: token.refreshToken,
  };
}
