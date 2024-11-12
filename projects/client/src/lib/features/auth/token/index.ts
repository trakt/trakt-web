const token: {
  value: string | Nil;
} = {
  value: null,
};

export function getToken() {
  return token.value;
}

export function setToken(value: string | Nil) {
  token.value = value;
}
