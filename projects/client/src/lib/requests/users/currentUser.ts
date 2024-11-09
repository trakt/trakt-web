import { api } from '../_internal/api.ts';
import { authHeader } from '$lib/requests/_internal/authHeader.ts';

export type User = {
  name: {
    full: string;
    first: string;
    last: string;
  };
  location?: string;
  avatar: {
    url: string;
  };
};

export function currentUser(): Promise<User> {
  return api.users.profile({
    params: { id: 'me' },
    query: {
      extended: 'full',
    },
    extraHeaders: {
      ...authHeader(),
    },
  }).then((response) => {
    if (response.status !== 200) {
      console.error('Error fetching current user', response);
      /**
       * TODO: define error handling strategy/system
       */
      throw new Error('Error fetching current user.');
    }

    const { body } = response;
    const fullName = body.name;
    const [firstName = '', lastName = ''] = body.name.split(' ');
    return {
      name: {
        full: fullName,
        first: firstName,
        last: lastName,
      },
      location: body.location,
      avatar: {
        url: body.images!.avatar.full,
      },
    };
  });
}
