// The transient query params the native apps append when they open a Year/Month
// in Review inside a WebView: the viewer's VIP token (`slurm`) and the
// standalone-mode chrome flag. Single source of truth for this native-app
// contract, captured and stripped from the URL on entry by
// `captureWebviewSession`.
export const WEBVIEW_PARAMS = {
  slurm: 'slurm',
  standaloneMode: 'standalone_mode',
} as const;
