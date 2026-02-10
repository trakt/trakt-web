import type { Handle } from '@sveltejs/kit';
import { isLegitimateBot } from './utils/isLegitimateBot.ts';

export const handle: Handle = async ({ event, resolve }) => {
  const userAgent = event.request.headers.get('user-agent') || '';
  const ipAddress = event.getClientAddress();

  // Verify if this is a legitimate bot via reverse DNS
  const legitimate = await isLegitimateBot(userAgent, ipAddress);
  event.locals.isLegitimateBot = legitimate;

  return resolve(event);
};
