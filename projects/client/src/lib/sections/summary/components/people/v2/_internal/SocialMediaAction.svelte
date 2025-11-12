<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import FacebookIcon from "$lib/components/icons/FacebookIcon.svelte";
  import InstagramIcon from "$lib/components/icons/InstagramIcon.svelte";
  import XIcon from "$lib/components/icons/XIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    username,
    type,
  }: {
    username: string;
    type: "x" | "facebook" | "instagram";
  } = $props();

  const { track } = useTrack(AnalyticsEvent.Link);

  const href = $derived.by(() => {
    switch (type) {
      case "x":
        return UrlBuilder.external.x(username);
      case "instagram":
        return UrlBuilder.external.instagram(username);
      case "facebook":
        return UrlBuilder.external.facebook(username);
    }
  });
</script>

<ActionButton
  {href}
  target="_blank"
  label={type}
  style="ghost"
  onclick={() => track({ target: type, source: "person-summary" })}
>
  {#if type === "x"}
    <XIcon />
  {/if}

  {#if type === "instagram"}
    <InstagramIcon />
  {/if}

  {#if type === "facebook"}
    <FacebookIcon />
  {/if}
</ActionButton>
