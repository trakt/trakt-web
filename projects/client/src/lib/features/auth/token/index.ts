type Token = {
  value: string | Nil;
  expiresAt: number | Nil;
};

const token: Token = {
  value: null,
  expiresAt: null,
};

export function getToken() {
  return { ...token };
}

export function setToken(newToken: Token | Nil) {
  if (!newToken) {
    token.value = null;
    token.expiresAt = null;
    return;
  }

  const { value, expiresAt } = newToken;
  token.expiresAt = expiresAt;
  token.value = value;
}
