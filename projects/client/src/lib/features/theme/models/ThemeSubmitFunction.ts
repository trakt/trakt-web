import type { ThemeResponse } from '$lib/features/theme/action.ts';
import type { SubmitFunction } from '@sveltejs/kit';

export type ThemeSubmitFunction = SubmitFunction<ThemeResponse>;
