// FIXME: stop AuthProvider's gate remounting its children when `$user` flaps on
// the CacheBust login triggers, then drop this latch.
let hasClaimed = false;

export function claimSigninCallback(): boolean {
  if (hasClaimed) {
    return false;
  }

  hasClaimed = true;
  return true;
}
