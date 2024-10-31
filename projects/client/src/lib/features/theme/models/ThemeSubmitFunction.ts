import type { SubmitFunction } from '@sveltejs/kit';
import { ThemeResponse } from '$lib/features/theme/action.ts';

export type ThemeSubmitFunction = SubmitFunction<ThemeResponse>;
