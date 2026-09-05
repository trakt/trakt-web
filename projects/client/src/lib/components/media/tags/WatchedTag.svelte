<script lang="ts">
  import type { DrawerLinkProps } from "$lib/components/media/tags/DrawerLinkProps.ts";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl.ts";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider.ts";
  import WatchCountTag from "$lib/components/media/tags/WatchCountTag.svelte";

  const {
    variant = "default",
    count = 0,
    i18n = TagIntlProvider,
    link,
    onclick,
  }: {
    variant?: "default" | "full";
    count?: number;
    i18n?: TagIntl;
    link?: DrawerLinkProps;
    onclick?: () => void;
  } = $props();
</script>

{#if variant === "full"}
  <WatchCountTag {count} {i18n} {link} {onclick} />
{:else}
  <IndicatorTag variant="full" indicator="watched" {count} />
{/if}
