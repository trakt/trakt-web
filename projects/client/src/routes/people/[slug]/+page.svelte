<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { crewPositionSchema } from "$lib/requests/models/CrewPosition";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import PeopleSummary from "$lib/sections/summary/PeopleSummary.svelte";
  import type { PageProps } from "./$types";
  import { usePerson } from "./usePerson";

  const { params }: PageProps = $props();

  const { person, isLoading } = $derived(usePerson(params.slug));

  const mapToCrewPosition = (value: string | Nil) => {
    return crewPositionSchema.safeParse(value?.toLowerCase()).data;
  };

  const positions = $derived.by(() => {
    const movies = mapToCrewPosition(page.url.searchParams.get("movies"));
    const shows = mapToCrewPosition(page.url.searchParams.get("shows"));

    return { movies, shows };
  });
</script>

<TraktPage
  audience="all"
  title={$person?.name}
  image={$person?.headshot?.url.medium}
>
  <RenderFor audience="authenticated">
    <NavbarStateSetter mode="minimal" />
  </RenderFor>

  {#if !$isLoading}
    <PeopleSummary person={$person!} {positions} />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
