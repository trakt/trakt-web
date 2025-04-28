import { describe, expect, it } from 'vitest';
import { isBotAgent } from './isBotAgent.ts';

describe('isBotAgent', () => {
  it('should return true for known bot user agents', () => {
    const botAgents = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Twitterbot/1.0',
      'WhatsApp/2.21.12.21 (iPhone)',
      'LinkedInBot/1.0 (compatible)',
    ];

    botAgents.forEach((agent) => {
      expect(isBotAgent(agent)).toBe(true);
    });
  });

  it('should return false for regular user agents', () => {
    const regularAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    ];

    regularAgents.forEach((agent) => {
      expect(isBotAgent(agent)).toBe(false);
    });
  });

  it('should return false for null or undefined user agents', () => {
    expect(isBotAgent(null)).toBe(false);
    expect(isBotAgent(undefined)).toBe(false);
  });

  it('should return false for empty string user agent', () => {
    expect(isBotAgent('')).toBe(false);
  });
});
