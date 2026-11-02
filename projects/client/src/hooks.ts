import { toShareImageRoute } from '$lib/features/share/toShareImageRoute.ts';
import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => toShareImageRoute(url.pathname);
