// Builds the `&slurm=…` query suffix for YIR/MIR data requests when a WebView
// VIP token is present, so it can be appended to a request path that already
// carries a query string. Empty when there is no token.
export function toSlurmQuery(slurm?: string): string {
  return slurm ? `&slurm=${encodeURIComponent(slurm)}` : '';
}
