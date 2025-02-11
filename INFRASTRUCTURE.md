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

## Summoning a Production Preview: A How-To Guide

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
