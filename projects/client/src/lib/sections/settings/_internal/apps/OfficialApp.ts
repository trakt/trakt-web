export type OfficialApp = Readonly<{
  name: string;
  iconUrl: string;
  destinations: ReadonlyArray<
    Readonly<{
      store: 'app-store' | 'google-play' | 'web';
      href: string;
    }>
  >;
}>;
