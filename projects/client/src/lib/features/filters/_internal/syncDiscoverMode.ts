import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { firstValueFrom } from 'rxjs';
import type { DiscoverMode } from '../models/DiscoverMode.ts';
import { DISCOVER_MODE_PARAM } from './constants.ts';

export async function syncDiscoverMode(searchParams: URLSearchParams) {
  const raw = searchParams.get(DISCOVER_MODE_PARAM);
  if (!raw) return;

  const { options, current, set } = useToggler('discover');

  const isValid = options.some((option) => option.value === raw);
  if (!isValid) return;

  const { value } = await firstValueFrom(current);
  if (value === raw) return;

  set(raw as DiscoverMode);
}
