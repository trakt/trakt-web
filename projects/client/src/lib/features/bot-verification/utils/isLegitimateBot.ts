import { error } from '$lib/utils/console/print.ts';

const LEGITIMATE_BOT_PATTERNS = {
  googlebot: /\.google(bot)?\.com$/i,
  bingbot: /\.search\.msn\.com$/i,
  duckduckbot: /\.duckduckgo\.com$/i,
} as const;

type BotType = keyof typeof LEGITIMATE_BOT_PATTERNS;

const DOH_ENDPOINT = 'https://cloudflare-dns.com/dns-query';

function identifyBotType(userAgent: string): BotType | null {
  const ua = userAgent.toLowerCase();
  for (const bot of Object.keys(LEGITIMATE_BOT_PATTERNS)) {
    if (ua.includes(bot)) {
      return bot as BotType;
    }
  }

  return null;
}

export function isIPv6(ip: string): boolean {
  return ip.includes(':');
}

export function expandIPv6(ip: string): string {
  const halves = ip.split('::');

  if (halves.length === 2) {
    const left = halves[0] ? halves[0].split(':') : [];
    const right = halves[1] ? halves[1].split(':') : [];
    const missing = 8 - left.length - right.length;
    const middle = Array(missing).fill('0000') as string[];
    return [...left, ...middle, ...right].map((g) => g.padStart(4, '0')).join(
      ':',
    );
  }

  return ip.split(':').map((g) => g.padStart(4, '0')).join(':');
}

async function reverseIpLookup(ip: string): Promise<string> {
  const ptr = isIPv6(ip)
    ? expandIPv6(ip).replace(/:/g, '').split('').reverse().join('.') +
      '.ip6.arpa'
    : ip.split('.').reverse().join('.') + '.in-addr.arpa';
  const url = `${DOH_ENDPOINT}?name=${encodeURIComponent(ptr)}&type=PTR`;

  const response = await fetch(url, {
    headers: { accept: 'application/dns-json' },
  });

  if (!response.ok) {
    throw new Error(`DNS PTR query failed: ${response.status}`);
  }

  const data = (await response.json()) as { Answer?: { data: string }[] };
  const hostname = data.Answer?.at(0)?.data?.replace(/\.$/, '');

  if (!hostname) {
    throw new Error(`No PTR record found for IP: ${ip}`);
  }

  return hostname;
}

async function forwardDnsLookup(
  hostname: string,
  recordType: 'A' | 'AAAA',
): Promise<string> {
  const url =
    `${DOH_ENDPOINT}?name=${encodeURIComponent(hostname)}&type=${recordType}`;

  const response = await fetch(url, {
    headers: { accept: 'application/dns-json' },
  });

  if (!response.ok) {
    throw new Error(`DNS ${recordType} query failed: ${response.status}`);
  }

  const data = (await response.json()) as { Answer?: { data: string }[] };
  const address = data.Answer?.at(0)?.data;

  if (!address) {
    throw new Error(`No ${recordType} record found for hostname: ${hostname}`);
  }

  return address;
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
    const ipv6 = isIPv6(ipAddress);
    const resolvedIp = await forwardDnsLookup(hostname, ipv6 ? 'AAAA' : 'A');

    return ipv6
      ? expandIPv6(resolvedIp) === expandIPv6(ipAddress)
      : resolvedIp === ipAddress;
  } catch (e) {
    // If DNS lookups fail, assume not a legitimate bot
    error('Bot verification failed:', { userAgent, ipAddress, error: e });
    return false;
  }
}
