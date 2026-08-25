<script lang="ts">
  import { showIntlQuery } from "$lib/requests/queries/shows/showIntlQuery.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import MediaGlanceDetails from "./MediaGlanceDetails.svelte";
  import MediaGlanceSkeleton from "./MediaGlanceSkeleton.svelte";
  import { useMediaGlance } from "./useMediaGlance.ts";

  const { slug }: { slug: string } = $props();

  const { media, crew, intl, isLoading } = useMediaGlance(
    fromRune(() => slug),
    {
      type: "show",
      summary: showSummaryQuery,
      people: showPeopleQuery,
      intl: showIntlQuery,
    },
  );
</script>

{#if $isLoading || !$media}
  <MediaGlanceSkeleton />
{:else}
  <MediaGlanceDetails type="show" media={$media} crew={$crew} intl={$intl} />
{/if}
