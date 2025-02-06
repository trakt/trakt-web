<script lang="ts">
  import { IS_DEV } from "$lib/utils/env";
  import posthog from "posthog-js";
  import { onMount } from "svelte";
  import AnalyticsLoader from "./_internal/loader/AnalyticsLoader.svelte";

  const { children }: ChildrenProps = $props();

  onMount(() => {
    if (IS_DEV) {
      return;
    }

    posthog.init(TRAKT_POST_HOG_TOKEN, {
      api_host: "https://the-hawg.trakt.tv",
      person_profiles: "identified_only",
    });
  });
</script>

<AnalyticsLoader
  onload={(userId) => {
    const isLoggedOut = userId === null;

    if (isLoggedOut) {
      posthog.reset();
      return;
    }

    posthog.identify(userId);
  }}
/>
{@render children()}
