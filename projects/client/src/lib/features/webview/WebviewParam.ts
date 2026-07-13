import type { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';

// One of the native-app WebView params (`slurm`, `standaloneMode`). Keys the
// generic latch/read core so a new param is added in one place (WEBVIEW_PARAMS)
// with no per-param branching.
export type WebviewParam = keyof typeof WEBVIEW_PARAMS;
