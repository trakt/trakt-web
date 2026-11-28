import { attachDecoration } from '../shared/attachDecoration.ts';

export function attachIbadEyes() {
  return attachDecoration({
    selector: '.trakt-profile-image',
    className: 'dn3-ibad',
  });
}
