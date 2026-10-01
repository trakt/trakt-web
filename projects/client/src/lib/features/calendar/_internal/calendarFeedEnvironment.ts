import { Environment } from '@trakt/api';

export function calendarFeedEnvironment(target: Environment): Environment {
  return target === Environment.production_private
    ? Environment.production
    : target;
}
