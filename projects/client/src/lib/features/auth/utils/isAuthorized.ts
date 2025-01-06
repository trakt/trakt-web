export function isAuthorized(locals: App.Locals): boolean {
  return locals.auth?.isAuthorized ?? false;
}
