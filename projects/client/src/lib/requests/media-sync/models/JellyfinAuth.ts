export type JellyfinLibraryOption = {
  externalId: string;
  kind: 'movies' | 'shows';
  title: string;
  itemCount: number | null;
};

export type JellyfinAuth =
  | {
      status: 'pending';
      attemptId: string;
      code: string;
      expiresIn: number | null;
      serverName: string;
    }
  | {
      status: 'authenticated';
      attemptId: string;
      serverName: string;
      libraries: JellyfinLibraryOption[];
    };
