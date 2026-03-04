<script lang="ts">
  import CalendarProvider from "$lib/features/calendar/CalendarProvider.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useActivityList } from "$lib/sections/lists/activity/_internal/useActivityList";

  import ActivityPaginatedList from "$lib/sections/lists/activity/ActivityPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { mode } = useDiscover();

  const { list, isLoading } = $derived(
    useActivityList({
      type: $mode,
      limit: 1,
    }),
  );
</script>

{#snippet navbarState(hasFilters: boolean)}
  <NavbarStateSetter {hasFilters}>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_social_activity()}
>
  <TraktPageCoverSetter />

  <RenderForFeature flag={FeatureFlag.HomeFilter}>
    {#snippet enabled()}
      {@render navbarState(true)}
    {/snippet}
    {@render navbarState(false)}
  </RenderForFeature>

  {#if !$isLoading}
    <CalendarProvider initialDate={$list.at(0)?.activityAt}>
      <ActivityPaginatedList />
    </CalendarProvider>
  {/if}
</TraktPage>
