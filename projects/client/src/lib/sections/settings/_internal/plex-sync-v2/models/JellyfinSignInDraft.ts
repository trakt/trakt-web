export type JellyfinSignInDraft = {
  serverUrl: string;
  method: 'quick-connect' | 'password';
  username: string;
  password: string;
};
