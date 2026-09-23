import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';

export const load = ({ params }: { params: { id: string } }) =>
  redirect(301, UrlBuilder.developer.app(params.id));
