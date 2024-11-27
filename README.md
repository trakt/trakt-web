# trakt-webapp

[![CI](https://github.com/trakt/trakt-webapp/actions/workflows/ci.yml/badge.svg)](https://github.com/trakt/trakt-webapp/actions/workflows/ci.yml)

[![CD](https://github.com/trakt/trakt-webapp/actions/workflows/cd.yml/badge.svg)](https://github.com/trakt/trakt-webapp/actions/workflows/cd.yml)

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
- **`swagger`:** The public notice board. A simple `hono` server that exposes
  the API contract as an OpenAPI/Swagger definition, providing clear
  documentation for those who wish to understand our methods.
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

### Deployment

- **`CLOUDFLARE_API_TOKEN`:** Cloudflare API token.
  - Go to [Cloudflare](https://dash.cloudflare.com/profile/api-tokens) and
    create a new token with the following permissions:
    - `Account:CloudflarePages:Edit`
- **`CLOUDFLARE_ACCOUNT_ID`:** Cloudflare account ID.
  - Go to [Cloudflare](https://dash.cloudflare.com/)
  - Choose the `Trakt` account
  - Copy the account ID from the URL

**NOTE:** Use the `trakt-ios` or `trakt-android` client ID and secret, as they
are the only ones that work with the private API.

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

- Swagger:
  - Serve: `deno task swagger`
  - Development: `deno task swagger:dev`

- Client:
  - Development: `deno task client:dev`

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

### Wrangler (Cloudflare) - Taming the Digital Wild West

#### Development Preview - A Glimpse Behind the Curtain

To peer into the swirling mists of development, you'll require the arcane power
of two terminals:

1. In the first, unleash the `Vite Preview` incantations.
2. In the second, whisper the following command:

```sh
[npx|bunx] wrangler pages dev .svelte-kit/cloudflare
```

**NOTE:** Deno, in its current form, remains blind to the secrets of VM modules
([a tale of woe and unfulfilled promises](https://github.com/denoland/deno/issues/26349)).
Thus, wrangler can only be previewed through the conduits of `npm` or `bun`.

#### Production Preview - A Vision of the Future

Ensure your digital presence resides within the `projects/client/` domain, then
intone the following incantation:

```sh
# This is required if the secrets are not already set or have changed
echo "$TRAKT_CLIENT_ID" | npx wrangler pages secret put TRAKT_CLIENT_ID
echo "$TRAKT_CLIENT_SECRET" | npx wrangler pages secret put TRAKT_CLIENT_SECRET

# This will build the client and deploy it to Cloudflare Pages
[deno|npm|bun] task build && npx wrangler pages deploy
```

**NOTE:** Resist the urge to unleash production deployments from your mortal
machine unless circumstances are dire. The `CD` pipeline, a tireless automaton,
stands ready to automatically project the client onto the Cloudflare Pages. This
command serves as a portal to conjure
[preview environments](https://developers.cloudflare.com/pages/configuration/preview-deployments/),
ephemeral realms where your team can witness the unfolding future.

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
