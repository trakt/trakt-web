const notFound = 404;

export function isMissingSubscription(response: Response): boolean {
  return response.status === notFound;
}
