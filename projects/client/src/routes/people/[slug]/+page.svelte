<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import PeopleSummary from "$lib/sections/summary/PeopleSummary.svelte";
  import type { PageProps } from "./$types";
  import { usePerson } from "./usePerson";

  const { params }: PageProps = $props();

  const { person, isLoading } = $derived(usePerson(params.slug));
</script>

<TraktPage
  audience="all"
  title={$person?.name}
  image={$person?.headshot?.url.medium}
>
  <NavbarStateSetter mode="minimal" />

  {#if !$isLoading}
    <PeopleSummary person={$person!} />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
