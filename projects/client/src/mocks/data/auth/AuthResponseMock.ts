export const AuthResponseMock = {
  access_token:
    'dbaf9757982a9e738f05d249b7b5b4a266b3a139049317c4909f2f263572c781',
  refresh_token:
    '76ba4c5c75c96f6087f58a4de10be6c00b29ea1ddc3b2022ee2016d1363e3a7c',
  expires_in: Math.floor(
    (new Date('2100-01-01T00:00:00.000Z').getTime() - Date.now()) / 1000,
  ),
};
