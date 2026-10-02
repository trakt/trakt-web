import type { UserMediaReactionsResponse } from '$lib/requests/models/UserMediaReactionsResponse.ts';

export const MovieHereticUserReactionsResponseMock: UserMediaReactionsResponse =
  [
    { id: 482, reaction: { type: 'shocked', emoji: '😱' } },
    { id: 483, reaction: { type: 'laugh', emoji: '😂' } },
  ];
