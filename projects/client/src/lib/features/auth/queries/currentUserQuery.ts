import type { ProfileResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import { api, type ApiParams } from '../../../requests/_internal/api.ts';

export type UserProfile = {
  name: {
    full: string;
    first: string;
    last: string;
  };
  location?: string;
  avatar: {
    url: string;
  };
  isVip: boolean;
};

function mapUserResponse(user: ProfileResponse): UserProfile {
  const fullName = user.name;
  const [firstName = '', lastName = ''] = user.name.split(' ');

  return {
    name: {
      full: fullName,
      first: firstName,
      last: lastName,
    },
    location: user.location,
    avatar: {
      url: user.images!.avatar.full,
    },
    isVip: user.vip || user.vip_ep,
  };
}

const currentUserRequest = ({ fetch }: ApiParams): Promise<UserProfile> =>
  api({ fetch })
    .users
    .profile({
      params: {
        id: 'me',
      },
      extraHeaders: {
        ...authHeader(),
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error fetching current user', response);
        /**
         * TODO: define error handling strategy/system
         */
        throw new Error('Error fetching current user.');
      }

      return response.body;
    })
    .then(mapUserResponse);

export const currentUserQueryKey = ['profile'] as const;
export const currentUserQuery = ({ fetch }: ApiParams = {}) => ({
  queryKey: currentUserQueryKey,
  queryFn: () => currentUserRequest({ fetch }),
});
