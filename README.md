# trakt-web

<a href="https://app.deepsource.com/gh/trakt/trakt-web/"><img src="https://app.deepsource.com/gh/trakt/trakt-web.svg/?label=code+coverage&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>
<a href="https://app.deepsource.com/gh/trakt/trakt-web/"><img src="https://app.deepsource.com/gh/trakt/trakt-web.svg/?label=active+issues&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>
<a href="https://app.deepsource.com/gh/trakt/trakt-web/"><img src="https://app.deepsource.com/gh/trakt/trakt-web.svg/?label=resolved+issues&show_trend=true&token=tiC5fNXEfyZqbFXqMggxzbWT" /></a>

<a href="https://github.com/trakt/trakt-web/actions/workflows/ci_cd.yml"><img src="https://github.com/trakt/trakt-web/actions/workflows/ci_cd.yml/badge.svg" /></a>

---

**Contributions are welcome!** Whether you want to fix a bug, improve a
translation, or build something new - PRs are open and encouraged. No need to
ask for permission first, just dive in. See
[CONTRIBUTING.md](.github/CONTRIBUTING.md) for the details.

---

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

> **Note:** Port 5173 is for development mode, while port 4173 is for production
> preview.

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

## Dependency Updates

We use [`npm-check-updates`](https://github.com/raineorshine/npm-check-updates)
(`ncu`) to drive package bumps. Two GitHub workflows automate the recurring
work; the manual recipes below stay around for ad-hoc runs.

### Automated Flows

Both workflows live under `.github/workflows/` and can be triggered from the
Actions tab via `workflow_dispatch`.

Both flows enumerate candidates with `ncu --jsonUpgraded`, then run
`.github/scripts/ncu-bisect.sh` to find the largest green subset.

**Bisection strategy (full set first, halve on failure):**

1. **Phase 1 (fast, typecheck-only):** apply the whole candidate set, run
   `deno install --allow-scripts` + `deno task check`. If green, adopt all. If
   red, split the set in half and recurse on each half. Singletons that fail are
   recorded as rejected; everything green stacks on a rolling baseline. Worst
   case for K candidates with F failures is roughly `F + log2(K)` probes (a
   clean batch of 30 = 1 probe; F=1 = ~6-9 probes).
2. **Phase 2 (final tests):** run `deno task test:doctor` (vitest, no coverage,
   parallel) on the adopted set. If it fails, re-bisect the adopted set with
   full verify (check + tests) to identify which adopted bump regressed at
   runtime.
3. **Phase 3 (build):** run `deno task build:doctor` (vite build with Sentry
   plugin off, no minify, no sourcemap; validates the module graph compiles
   end-to-end without network/auth side effects).

Local dry-run on a 30-candidate minor set with 2 failures: 15 probes, ~7.5 min
wall time (vs. ~60 min for sequential per-package).

`ncu --doctor` is not used: it spawns `npm install --no-save <pkg>@<ver>` per
candidate, which conflicts with this project's peer-dep state and would not
actually exercise the deno-managed test runtime even if it succeeded.

i18n is generated once at the start of the workflow (the per-task `pretest` /
`prebuild` hooks are skipped by the doctor variants).

#### `packages_minor.yml` - Minor & Patch Bumps

- **Cadence:** every Sunday at 18:00 UTC.
- **Scope:** minor + patch versions (`ncu --target minor`).
- **On any green:** opens `chore(deps): bump minor & patch versions` PR with
  reviewers `seferturan` and `vladjerca`. PR body lists adopted + reverted.
- **On nothing green:** no PR; reverted set surfaces in the workflow log.

#### `packages_major.yml` - Major Bumps

- **Cadence:** first Sunday of each month at 19:00 UTC (cron gates by
  day-of-month).
- **Scope:** major-version diffs only (`ncu --target latest` minus the
  `--target minor` set).
- **On any green:** opens `chore(deps): bump major versions` PR, listing
  adopted + skipped.
- **On any red:** opens a companion issue assigned to `seferturan` with the
  reverted packages and the last 80 log lines per package.

### Manual Recipes

If you need to run `ncu` locally, install it once:

```bash
deno install -g --allow-all -n ncu npm:npm-check-updates
```

NOTE: For the client project pass `-p npm` on every invocation since the svelte
project is defined via `package.json` (the workspace itself uses deno). Run the
commands below from `projects/client/`.

#### Minor

- **Check:** `ncu -p npm --dep prod -t minor` / `ncu -p npm --dep dev -t minor`
- **Update:** add `-u` to write changes.

#### Major

- **Check:** `ncu -p npm --dep prod -t latest` /
  `ncu -p npm --dep dev -t latest`
- For each entry: `ncu -p npm <ENTRY> -u -t latest`, then build, fix breaks,
  test, commit.

After any local bump, refresh the lockfile with `deno install --allow-scripts`
before committing.

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

## Acknowledgements

Trakt Web is made possible by these amazing tools and services:

<a href="https://svelte.dev/"><img src="https://img.shields.io/badge/Built_with-SvelteKit-FF3E00?logo=svelte&logoColor=white" alt="Built with SvelteKit" /></a>
<a href="https://sentry.io/"><img src="https://img.shields.io/badge/Monitoring_by-Sentry-362D59?logo=sentry&logoColor=white" alt="Monitoring by Sentry" /></a>
<a href="https://crowdin.com/"><img src="https://img.shields.io/badge/Localized_with-Crowdin-2E3340?logo=crowdin&logoColor=white" alt="Localized with Crowdin" /></a>

Special thanks to [Sentry](https://sentry.io/) and
[Crowdin](https://crowdin.com/) for supporting open source projects with free
licenses.
