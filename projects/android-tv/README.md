# trakt-lite on android tv

## Pre-requisites

- Install [Android Studio](https://developer.android.com/studio).
- If there is no run/debug config:
  - Add a new config.
  - Name it however you want.
  - Choose `Trakt.app.main` as the Module.
- If you want to test it in Android Studio:
  [create virtual devices](https://developer.android.com/studio/run/managing-avds)
  in Android Studio.
  - It is recommended to create either a 1080p TV or a 4K TV.
  - Note: the virtual devices need a recent enough version of Android System
    WebView.

## Developing

- Start a local development server for Trakt Lite. For more details on how to do
  that, see: [README.md](../client/README.md).
- Open this folder in Android Studio.
  - If `Run` is not available, sync the project with the gradle files (in
    Android Studio `File -> Sync Project with Gradle Files`).
- Make sure your active build variant is set to `debug`.
- Select one of your virtual TVs as the device, and `Run`.
  - Note: not physically run, but run in Android Studio.
- For debugging the webview, you can use `chrome://inspect/#devices` in Chrome.
  See [README.md](../../README.md) for more details.

## Building

If you want to create an APK:

- Change the build variant to `release`.
- Then in the `Build` menu select `Build App Bundle(s) / APK(s)` ->
  `Build APK(s)`
- Once done, click `locate` to get your APK.
  - It should be located in (`build/outputs/apk/release`).
  - Note: this first version is not a properly signed APK.
