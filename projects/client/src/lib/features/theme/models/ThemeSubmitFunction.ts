import type { SubmitFunction } from '@sveltejs/kit';
import type { ThemeResponse } from '$lib/features/theme/action.ts';

export type ThemeSubmitFunction = SubmitFunction<ThemeResponse>;
