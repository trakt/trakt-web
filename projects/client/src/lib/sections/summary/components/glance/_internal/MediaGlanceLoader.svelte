<script lang="ts" generics="T extends MediaEntry">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import MediaGlanceSkeleton from "./MediaGlanceSkeleton.svelte";
  import type { MediaGlanceLoaderProps } from "./MediaGlanceLoaderProps.ts";
  import { useMediaGlance } from "./useMediaGlance.ts";

  const { slug, queries, details }: MediaGlanceLoaderProps<T> = $props();

  // svelte-ignore state_referenced_locally
  const { media, crew, intl, isLoading } = useMediaGlance(
    fromRune(() => slug),
    queries,
  );
</script>

{#if $isLoading || !$media}
  <MediaGlanceSkeleton />
{:else}
  {@render details($media, $crew, $intl)}
{/if}
