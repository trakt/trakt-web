export const isWebOs = (userAgent: string): boolean => {
  const agent = userAgent.toLowerCase();
  const isWebOs = agent.includes('web0s') || agent.includes('webos');

  return isWebOs;
};

export function isTV(userAgent: string | Nil) {
  if (!userAgent) {
    return false;
  }

  return isWebOs(userAgent);
}
