# trakt-webapp

![CI](https://github.com/trakt/trakt-webapp/actions/workflows/ci.yml/badge.svg)

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

- **`TRAKT_CLIENT_ID`:** The client ID for the Trakt API.
- **`TRAKT_CLIENT_SECRET`:** The client secret for the Trakt API.
  - Required for the `playground` project.

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

### Wrangler

To preview via Wrangler you'll need 2 terminals:

1. In one terminal, `Vite Preview` commands.
1. In the other terminal:

```sh
[npx|bunx] wrangler pages dev .svelte-kit/cloudflare
```

**NOTE**: Deno does not support
[VM modules as of yet](https://github.com/denoland/deno/issues/26349), wrangler
can only be preview via `npm` or `bun`.
