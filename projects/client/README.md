# trakt-web

## Developing

Install dependencies with `bun install`, start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with
`bun run build && bun run preview`.

> To deploy your app, you may need to install an
> [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## End-to-end tests

Install the browsers:

```bash
bun x playwright install chromium
```

First, make sure a dev server is running.

You can run the end-to-end tests as follows: `bun run test:e2e`.

Optionally, you can set the following environment variables:

```bash
E2E_HEADLESS: 'true'
E2E_BASE_URL: 'http://localhost:5173/'
```
