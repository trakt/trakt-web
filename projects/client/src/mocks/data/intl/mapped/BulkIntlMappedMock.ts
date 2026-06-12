import type { BulkIntl } from '$lib/requests/models/BulkIntl.ts';

export const BulkIntlMappedMock: BulkIntl = {
  movie: new Map([
    [101, 'El Hereje'],
    [202, 'La Matriz'],
  ]),
  show: new Map([
    [303, 'Silo (ES)'],
  ]),
  episode: new Map([
    [404, 'Episodio piloto'],
  ]),
};
