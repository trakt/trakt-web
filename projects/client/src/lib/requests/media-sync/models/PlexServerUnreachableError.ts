export class PlexServerUnreachableError extends Error {
  constructor(serverId: string) {
    super(`Plex server ${serverId} is unreachable`);
    this.name = 'PlexServerUnreachableError';
  }
}
