export function subscriptionRequestError(
  key: string,
  response: Response,
): Error {
  return new Error(`Failed to fetch data: ${key} (${response.status})`);
}
