export type AuthToken = {
  type: 'exchange';
  code: string;
} | {
  type: 'refresh';
  refreshToken: string;
};
