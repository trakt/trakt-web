# Infrastructure

## Environment Variables

The following environment variables are required for the workspace to function
properly:

### Deployment

- **`CLOUDFLARE_API_TOKEN`:** Cloudflare API token.
  - Go to [Cloudflare](https://dash.cloudflare.com/profile/api-tokens) and
    create a new token with the following permissions:
    - `Account:CloudflarePages:Edit`
- **`CLOUDFLARE_ACCOUNT_ID`:** Cloudflare account ID.
  - Go to [Cloudflare](https://dash.cloudflare.com/)
  - Choose the `Trakt` account
  - Copy the account ID from the URL

## Setting Up a Production Preview

### Wrangler (Cloudflare) Setup

#### Development Preview

To run a development preview, you'll need two terminals:

1. In the first terminal, start the `Vite Preview` server.
2. In the second terminal, run:

```sh
[npx|bunx] wrangler pages dev .svelte-kit/cloudflare
```

**NOTE:** Deno currently doesn't support VM modules
([see issue](https://github.com/denoland/deno/issues/26349)), so wrangler can
only be previewed using `npm` or `bun`.

#### Production Preview

Navigate to the `projects/client/` directory and run:

```sh
# This is required if the secrets are not already set or have changed
echo "$TRAKT_CLIENT_ID" | npx wrangler secret put TRAKT_CLIENT_ID
echo "$TRAKT_CLIENT_SECRET" | npx wrangler secret put TRAKT_CLIENT_SECRET

# This will build the client and deploy it to Cloudflare Workers
[deno|npm|bun] task build && npx wrangler deploy
```

**NOTE:** Try to avoid running production deployments from your local machine.
The `CI/CD` pipeline automatically deploys the client to Cloudflare Workers.
This command is primarily intended for creating
[preview environments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
where your team can review changes before they go live.

### Typesense

To take advantage of client-side search functionality, you need to configure the
following environment variables:

This handler requires the following environment variables to be configured:

- **`TYPESENSE_CLIENT_KEY`**: The API key used to authenticate with the
  Typesense search server. This key is used to generate scoped search keys for
  both media and people searches.
- **`TYPESENSE_SERVER`**: The URL of the Typesense server endpoint (e.g.,
  `https://your-typesense-server.com`). This specifies which Typesense instance
  to connect to for search operations.
