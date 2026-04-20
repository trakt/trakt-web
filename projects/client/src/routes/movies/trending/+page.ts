import { UrlBuilder } from '$lib/utils/url/UrlBuilder';
import { redirect } from '@sveltejs/kit';

export const load = () => redirect(301, UrlBuilder.trending({ mode: 'movie' }));
