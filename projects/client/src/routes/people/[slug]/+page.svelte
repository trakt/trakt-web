<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import PeopleSummary from "$lib/sections/summary/PeopleSummary.svelte";
  import { usePerson } from "./usePerson";

  const { person, isLoading } = $derived(usePerson(page.params.slug));
</script>

<TraktPage audience="all" title={$person?.name} image={$person?.headShotUrl}>
  {#if !$isLoading}
    <PeopleSummary person={$person!} />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
