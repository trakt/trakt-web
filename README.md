# trakt-lite

<a href="https://app.deepsource.com/gh/trakt/trakt-lite/"><img src="https://app.deepsource.com/gh/trakt/trakt-lite.svg/?label=code+coverage&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>
<a href="https://app.deepsource.com/gh/trakt/trakt-lite/"><img src="https://app.deepsource.com/gh/trakt/trakt-lite.svg/?label=active+issues&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>
<a href="https://app.deepsource.com/gh/trakt/trakt-lite/"><img src="https://app.deepsource.com/gh/trakt/trakt-lite.svg/?label=resolved+issues&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>

<a href="https://github.com/trakt/trakt-lite/actions/workflows/ci.yml"><img src="https://github.com/trakt/trakt-lite/actions/workflows/ci.yml/badge.svg" /></a>
<a href="https://github.com/trakt/trakt-lite/actions/workflows/cd.yml"><img src="https://github.com/trakt/trakt-lite/actions/workflows/cd.yml/badge.svg" /></a>

<a href="https://codeclimate.com/github/trakt/trakt-lite/maintainability"><img src="https://api.codeclimate.com/v1/badges/694f2ec7960d2af769be/maintainability" /></a>
<a href="https://codeclimate.com/github/trakt/trakt-lite/test_coverage"><img src="https://api.codeclimate.com/v1/badges/694f2ec7960d2af769be/test_coverage" /></a>

## Project Structure

This [workspace](https://docs.deno.com/runtime/fundamentals/workspaces/) is
composed of multiple interconnected projects:

- **`api`:** The beating heart of our operation. This project defines the Trakt
  API interactions using `ts-rest` and `zod` for type-safe communication and
  validation. Think of it as our precinct's meticulously organized evidence
  board.
- **`playground`:** Our detective's sandbox. This CLI project allows for
  effortless exploration and experimentation with the Trakt API. It's where we
  test our hunches and follow the leads.
- **`openapi`:** The public notice board. A simple `hono` server that exposes
  the API contract as an OpenAPI definition, providing clear documentation for
  those who wish to understand our methods.
- **`client`:** The gleaming chrome of our pursuit. This project houses the
  Trakt Lite client, a sleek and efficient machine built with Deno and
  SvelteKit. It's the polished facade, the fast car we use to chase down those
  elusive media insights. (Just try not to crash it into a dumpster fire like
  last time.)

## Environment Variables

The following environment variables are required for the workspace to function
properly:

### Development

- **`TRAKT_CLIENT_ID`:** The client ID for the Trakt API.
- **`TRAKT_CLIENT_SECRET`:** The client secret for the Trakt API.
  - Required for the `playground` project.
- **`TRAKT_SESSION_SECRET`:** The session encryption secret for the Trakt API.
  - `deno task insecurity:generate`

### External Contribution - Unleash Your Inner Code Wizard!

Want to contribute to Trakt Lite and leave your mark on the digital tapestry of
media? Excellent! Here's how to tap into your inner code-slinging sorcerer:

1. **Summon a Trakt Application:** Venture forth to the
   [Trakt Settings](https://trakt.tv/oauth/applications) and conjure a new
   application. It's like creating a digital familiar, ready to do your bidding.
1. **Set the `Redirect uri:`:** Point this mystical path to
   `http://localhost:5173/` - the gateway to your local development realm.
1. **Set the `Javascript (cors) origins:`:** Ensure this incantation also points
   to `http://localhost:5173/` to allow cross-origin sorcery.
1. Now that you've forged your Trakt application, it's time to imbue your
   development environment with the mystical energies of the Client ID and
   Client Secret.

**A Word of Caution, Fellow Traveler:**

While public applications can be used, they might withhold some of their
secrets. Think of it as a trial version of an ancient spellbook. Limitations
include:

- **"Up Next" Dysfunction:** This powerful prophecy, revealing your future
  viewing pleasures, will be temporarily silenced.

Fear not, for these measures are in place to protect Trakt Lite from the
nefarious clutches of scrapers and bots. We wouldn't want our precious data to
fall into the wrong hands, would we?

Now go forth and code with the fury of a thousand suns! The future of Trakt Lite
awaits your brilliance. ✨

## Getting Started

This is a Deno project, so you need to have Deno installed on your machine
please refer to the
[Deno installation guide](https://docs.deno.com/runtime/getting_started/installation/).

1. **Clone the repository**
1. **Install dependencies:** `deno task install`
1. **Run tasks:**

- Workspace:
  - Format & Lint: `deno task format`

- Playground:
  - Development: `deno task playground:dev`

- OpenAPI:
  - Serve: `deno task openapi`
  - Development: `deno task openapi:dev`

- Client:
  - Development: `deno task client:dev`
  - Contributors: `deno task client:dev:contrib`

## Client Environment - Traversing the Digital Landscape

### Web - Navigating the Browser Realm

To embark on your web development journey, simply utter the incantation
`deno task dev` or `deno task dev:contrib` (for external contributors) within
the hallowed halls of the `projects/client` directory. Then, summon forth the
browser of your choice, and behold the fruits of your labor.

### Android - Taming the Mobile Beast

Should you seek to venture into the untamed wilds of Android development, this
guide shall illuminate your path, granting you the power to:

- **Install Development PWA:** Summon forth a development version of the
  Progressive Web App, and bind it to your Android device. (Fear not, for the
  arcane art of remote debugging shall be at your disposal.)
- **Debug Website Version:** Should you prefer the familiar comforts of the
  Chrome browser, you may also conjure forth the website version and subject it
  to your debugging scrutiny.

To embark on this mobile odyssey, consult the Chrome Remote Debugging
[grimoire](https://developer.chrome.com/docs/devtools/remote-debugging/). Within
its pages lies the knowledge to establish a connection between your development
environment and the Android realm.

The device management portal, accessible via the incantation
`chrome://inspect/#devices`, shall serve as your gateway to the Android domain.
It functions with both:

- **Option 1: Android Studio Emulated Device:** A simulated realm, where digital
  phantoms mimic the behavior of physical devices.
- **Option 2: Physical Device (USB Connection):** A tangible device, tethered to
  your development machine via the umbilical cord of USB.

Once you have established a connection, invoke the following command to
establish a reverse proxy:

```bash
adb reverse tcp:5173 tcp:5173
```

### iOS - Conquering the Apple Domain

**Coming Soon!**

## Build Trakt Lite

To build the Trakt Lite client, run the following command:

```sh
cd projects/client/
[deno|npm|bun] run build
```

## Summoning a Production Preview: A How-To Guide

### Vite

Simply run the following command:

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

## Resolving the Multilingual Mayhem

### A Guide to i18n Conflict Resolution

Should the chaotic forces of rebasing leave your `client/i18n/messages` folder
in a state of disarray, fear not, intrepid developer. For within this document
lies the knowledge to restore harmony to the realm of translations.

When merging your linguistic endeavors with the `main` branch, conflicts may
arise within the `client/i18n/messages` domain. This is to be expected, for the
path of internationalization is fraught with peril and unexpected detours.

To navigate this linguistic labyrinth and emerge victorious, follow these steps:

1. **Ensure the presence of the `deno` CLI:** This digital incantation, a key to
   unlocking the secrets of conflict resolution, must be present within your
   development arsenal.
2. **Invoke the resolution ritual:** From the heart of the project, intone the
   following command:

   ```bash
   deno task client:i18n:resolve
   ```

   Alternatively, should you find yourself within the `projects/client` domain,
   utter this incantation:

   ```bash
   deno task i18n:resolve
   ```

These commands, like ancient spells whispered in the dead of night, shall
resolve the conflicts and restore order to the `i18n/messages/*.json` files. The
translations, once fragmented and disjointed, shall merge into a harmonious
symphony of multilingual understanding.

With these tools at your disposal, you shall emerge from the chaos of rebasing
with your sanity intact and your translations unified. Go forth, and conquer the
linguistic challenges that lie before you.

For more details about infrastructure, see:
[INFRASTRUCTURE.md](INFRASTRUCTURE.md).
