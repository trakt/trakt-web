export type SerializedAuthResponse = {
  isAuthorized: true;
  token: {
    access: string;
    refresh: string;
  };
  expiresAt: number;
} | {
  isAuthorized: false;
  token: {
    access?: never;
    refresh?: never;
  };
  expiresAt?: never;
};
