# trakt-lite

## Developing

Install dependencies with `deno install`, start a development server:

```bash
deno task dev

# or start the server and open the app in a new browser tab
deno task dev -- --open
```

## Building

To create a production version of your app:

```bash
deno task build
```

You can preview the production build with
`deno task build && deno task preview`.

> To deploy your app, you may need to install an
> [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## End-to-end tests

Install the browsers:

```bash
deno run -A npm:@playwright/test install chromium
```

First, make sure a dev server is running.

You can run the end-to-end tests as follows: `deno task test:e2e`.

Optionally, you can set the following environment variables:

```bash
E2E_HEADLESS: 'true'
E2E_BASE_URL: 'http://localhost:5173/'
```
