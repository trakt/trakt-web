type SentryDsn = {
  host: string;
  projectId: string;
};

export function parseSentryDsn(dsn: string): SentryDsn | null {
  try {
    const { host, pathname } = new URL(dsn);
    const projectId = pathname.replace(/^\/+/, '');

    if (!host || !projectId) {
      return null;
    }

    return { host, projectId };
  } catch {
    return null;
  }
}
