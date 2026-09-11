import { Environment } from '@trakt/api';

// The site talks to the private API host, but a subscription URL gets pasted
// into third-party calendar apps, so it has to target the public host.
export function calendarFeedEnvironment(target: Environment): Environment {
  return target === Environment.production_private
    ? Environment.production
    : target;
}
