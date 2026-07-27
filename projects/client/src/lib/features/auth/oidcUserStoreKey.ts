type OidcUserStoreKeyProps = {
  authority: string;
  clientId: string;
};

// Key shape is dictated by oidc-client-ts, not by us.
export function oidcUserStoreKey(
  { authority, clientId }: OidcUserStoreKeyProps,
): string {
  return `oidc.user:${authority}:${clientId}`;
}
