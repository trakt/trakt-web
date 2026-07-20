<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { shortcut } from "@svelte-put/shortcut";

  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { isTextInputTarget } from "$lib/utils/events/isTextInputTarget";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { isAuthorized } = useAuth();

  const EXCLUDED_ROUTES = new Set(["/welcome"]);
</script>

<svelte:window
  use:shortcut={{
    trigger: {
      key: "/",
      enabled: $isAuthorized && !EXCLUDED_ROUTES.has(page.url.pathname),
      callback: ({ originalEvent }) => {
        if (isTextInputTarget(originalEvent.target)) return;
        if (originalEvent.ctrlKey || originalEvent.metaKey || originalEvent.altKey) return;
        originalEvent.preventDefault();
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto(UrlBuilder.search());
      },
    },
  }}
/>
