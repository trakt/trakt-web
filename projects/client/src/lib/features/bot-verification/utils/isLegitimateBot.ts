import { error } from '$lib/utils/console/print.ts';
import { promises as dns } from 'node:dns';

const LEGITIMATE_BOT_PATTERNS = {
  googlebot: /\.google(bot)?\.com$/i,
  bingbot: /\.search\.msn\.com$/i,
  duckduckbot: /\.duckduckgo\.com$/i,
  slackbot: /\.slack\.com$/i,
  twitterbot: /\.twitter\.com$/i,
  facebookexternalhit: /\.facebook\.com$/i,
  linkedinbot: /\.linkedin\.com$/i,
} as const;

type BotType = keyof typeof LEGITIMATE_BOT_PATTERNS;

function identifyBotType(userAgent: string): BotType | null {
  const ua = userAgent.toLowerCase();
  for (const bot of Object.keys(LEGITIMATE_BOT_PATTERNS)) {
    if (ua.includes(bot)) {
      return bot as BotType;
    }
  }

  return null;
}

async function reverseIpLookup(ip: string): Promise<string> {
  const hostnames = await dns.reverse(ip);
  const hostname = hostnames.at(0);

  if (!hostname) {
    throw new Error(`No hostname found for IP: ${ip}`);
  }

  return hostname;
}

async function forwardDnsLookup(hostname: string): Promise<string> {
  const result = await dns.lookup(hostname);
  return result.address;
}

export async function isLegitimateBot(
  userAgent: string,
  ipAddress: string,
): Promise<boolean> {
  const botType = identifyBotType(userAgent);
  if (!botType) return false;

  try {
    // Step 1: Reverse DNS lookup to get hostname from IP
    const hostname = await reverseIpLookup(ipAddress);
    const pattern = LEGITIMATE_BOT_PATTERNS[botType];

    // Step 2: Verify hostname matches expected pattern
    if (!pattern.test(hostname)) {
      return false;
    }

    // Step 3: Forward DNS lookup to verify hostname resolves back to original IP
    const resolvedIp = await forwardDnsLookup(hostname);
    return resolvedIp === ipAddress;
  } catch (e) {
    // If DNS lookups fail, assume not a legitimate bot
    error('Bot verification failed:', { userAgent, ipAddress, error: e });
    return false;
  }
}
