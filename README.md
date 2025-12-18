# trakt-web

<a href="https://app.deepsource.com/gh/trakt/trakt-web/"><img src="https://app.deepsource.com/gh/trakt/trakt-web.svg/?label=code+coverage&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>
<a href="https://app.deepsource.com/gh/trakt/trakt-web/"><img src="https://app.deepsource.com/gh/trakt/trakt-web.svg/?label=active+issues&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>
<a href="https://app.deepsource.com/gh/trakt/trakt-web/"><img src="https://app.deepsource.com/gh/trakt/trakt-web.svg/?label=resolved+issues&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>

<a href="https://github.com/trakt/trakt-web/actions/workflows/ci_cd.yml"><img src="https://github.com/trakt/trakt-web/actions/workflows/ci_cd.yml/badge.svg" /></a>

## Project Structure

This [workspace](https://docs.deno.com/runtime/fundamentals/workspaces/) is
composed the following projects:

- **`client`:** The frontend of our application. This project houses the Trakt
  Web client, built with Deno and SvelteKit. It's designed to be efficient and
  user-friendly, providing quick access to media insights.

## Environment Variables

The following environment variables are required for the workspace to function
properly:

### Development

- **`TRAKT_CLIENT_ID`:** The client ID for the Trakt API.
- **`TRAKT_CLIENT_SECRET`:** The client secret for the Trakt API.

### External Contribution - Get Involved!

Want to contribute to Trakt Web? Great! Here's how to get set up:

1. **Create a Trakt Application:** Go to
   [Trakt Settings](https://trakt.tv/oauth/applications) and create a new
   application.
1. **Set the `Redirect uri:`:** Add the following URIs (one per line):
   - `http://localhost:5173`
   - `http://localhost:5173/callback`
   - `http://localhost:4173`
   - `http://localhost:4173/callback`
1. **Set the `Javascript (cors) origins:`:** Add the following origins (one per
   line):
   - `http://localhost:5173`
   - `http://localhost:5173/callback`
   - `http://localhost:4173`
   - `http://localhost:4173/callback`
1. Use the Client ID and Client Secret in your development environment.

> **Note:** Port 5173 is for development mode, while port 4173 is for production preview.

## Getting Started

This is a Deno project, so you need to have Deno installed on your machine
please refer to the
[Deno installation guide](https://docs.deno.com/runtime/getting_started/installation/).

1. **Clone the repository**
1. **Install dependencies:** `deno task install`
1. **Run tasks:**

- Workspace:
  - Format & Lint: `deno task format`

- Client:
  - Development: `deno task client:dev`
  - Contributors: `deno task client:dev:contrib`

## Client Environment - Development Setup

### Web Development

For web development, run `deno task dev` or `deno task dev:contrib` (for
external contributors) in the `projects/client` directory. Then open your
browser to see your work.

### Android Development

For Android development, you can:

- **Install Development PWA:** Install a development version of the Progressive
  Web App on your Android device with remote debugging capabilities.
- **Debug Website Version:** Use Chrome browser for debugging the website
  version.

To set this up, refer to the Chrome Remote Debugging
[documentation](https://developer.chrome.com/docs/devtools/remote-debugging/).
Connect your development environment to Android through the device management
portal at `chrome://inspect/#devices`. This works with:

- **Option 1: Android Studio Emulated Device**
- **Option 2: Physical Device (USB Connection)**

After connecting, set up a reverse proxy with:

```bash
adb reverse tcp:5173 tcp:5173
```

### iOS Development

**Coming Soon!**

## Build Trakt Web

To build the Trakt Web client, run:

```sh
cd projects/client/
[deno|npm|bun] run build
```

## Production Preview

### Vite

Run the following command:

```sh
[deno|npm|bun] run build:preview && [deno|npm|bun] run preview
```

## Update Minor Dependencies

### Install `npm-check-updates`

```bash
deno install -g --allow-all -n ncu npm:npm-check-updates
```

NOTE: For the client project add the `-p npm` since we're using a `package.json`
definition for the svelte project.

### Production

- **Check:** `ncu --dep prod -t minor`
- **Update:** `ncu --dep prod -t minor -u`

### Development

- **Check:** `ncu --dep dev -t minor`
- **Update:** `ncu --dep dev -t minor -u`

Verify that the above steps run smoothly and revert any changes that break the
build (this should generally not be the case).

## Update Major Dependencies

- **Production:** `ncu --dep prod -t latest`
- **Development:** `ncu --dep dev -t latest`

For each entry listed as a result:

1. `ncu <ENTRY> -u -t latest`
1. Build
1. Update any breaks
1. Test
1. Commit

## Resolving i18n Conflicts

### Handling Translation Conflicts

If rebasing causes conflicts in your `client/i18n/messages` folder, here's how
to fix them:

When merging your changes with the `main` branch, conflicts may occur in
translation files. This is normal when multiple people are working on
internationalization.

To resolve these conflicts:

1. **Make sure you have the `deno` CLI installed**
2. **Run the resolution command** from the project root:

   ```bash
   deno task client:i18n:resolve
   ```

   Or if you're in the `projects/client` directory:

   ```bash
   deno task i18n:resolve
   ```

These commands will resolve conflicts in the `i18n/messages/*.json` files and
merge the translations properly.

For more details about infrastructure, see:
[INFRASTRUCTURE.md](INFRASTRUCTURE.md).
