import type { SocialIdsResponse } from '@trakt/api';

type ResponseWithSocialIds = {
  social_ids?: SocialIdsResponse | Nil;
};

export function mapToSocialMedia<T extends ResponseWithSocialIds>(response: T) {
  if (!response.social_ids) {
    return;
  }

  return {
    x: response.social_ids.twitter,
    instagram: response.social_ids.instagram,
    facebook: response.social_ids.facebook,
    wikipedia: response.social_ids.wikipedia,
  };
}
