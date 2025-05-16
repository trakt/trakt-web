type Token = {
  value: string | Nil;
  expiresAt: number | Nil;
  isDirector?: boolean;
};

const token: Token = {
  value: null,
  expiresAt: null,
  isDirector: false,
};

export function getToken() {
  return { ...token };
}

export function setToken(newToken: Token | Nil) {
  token.isDirector = newToken?.isDirector ?? false;

  if (!newToken) {
    token.value = null;
    token.expiresAt = null;
    return;
  }

  const { value, expiresAt } = newToken;
  token.expiresAt = expiresAt;
  token.value = value;
}
