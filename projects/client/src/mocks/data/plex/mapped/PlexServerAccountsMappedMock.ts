import { PlexServerAccountsResponseMock } from '../response/PlexServerAccountsResponseMock.ts';

export const PlexServerAccountsMappedMock = {
  accounts: PlexServerAccountsResponseMock.accounts,
  libraries: PlexServerAccountsResponseMock.libraries.map((lib) => ({
    id: lib.id,
    uuid: lib.uuid,
    type: lib.type,
    title: lib.title,
    agent: lib.agent,
    scanner: lib.scanner,
    isSelected: lib.selected,
    url: lib.url,
  })),
};
