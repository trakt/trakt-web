// List of known bots and crawlers, including social media platforms
const bots = [
  // Search engine bots
  'Googlebot',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'Sogou',
  'Exabot',
  'ia_archiver',

  // Social media bots
  'facebot',
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'WhatsApp',
  'Discordbot',
  'Pinterest',
  'TelegramBot',
  'Viber',
  'SkypeUriPreview',
  'Bluesky',

  // Other bots
  'MJ12bot',
  'AhrefsBot',
  'SemrushBot',
  'DotBot',
  'BLEXBot',
  'UptimeRobot',
  'PetalBot',
  'SeznamBot',
  'Qwantify',
  'CocCocBot',
  'Applebot',
  'Yeti',
  'Google-Structured-Data-Testing-Tool',
  'Google-PageSpeed-Insights',
];

export function isBotAgent(userAgent: string | Nil): boolean {
  return bots.some((bot) =>
    Boolean(userAgent?.toLowerCase().includes(bot.toLowerCase()))
  );
}
