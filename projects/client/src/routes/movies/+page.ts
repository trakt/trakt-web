import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';

export const load = () => redirect(301, UrlBuilder.discover({ mode: 'movie' }));
