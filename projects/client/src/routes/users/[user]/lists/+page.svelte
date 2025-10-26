<script lang="ts">
  import { type DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListRenderer from "$lib/sections/lists/smart/SmartListRenderer.svelte";
  import ListsHeader from "$lib/sections/lists/user/_internal/ListsHeader.svelte";
  import PersonalLists from "$lib/sections/lists/user/PersonalLists.svelte";
  import WatchList from "$lib/sections/lists/watchlist/WatchList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { mode } = useDiscover();
</script>

{#snippet content(mode?: DiscoverMode)}
  <WatchList
    drilldownLabel={m.button_label_view_all_watchlist_items()}
    status="all"
    type={mode}
  />

  <PersonalLists slug="me" type="personal" {mode} />
  <PersonalLists slug="me" type="liked" {mode} />
  <PersonalLists slug="me" type="collaboration" {mode} />

  <RenderFor audience="director">
    <div class="trakt-lists-preview">
      <ListsHeader title="Smart lists" />

      {#if mode === "media" || !mode}
        <SmartListRenderer type="movie" />
        <SmartListRenderer type="show" />
      {:else}
        <SmartListRenderer type={mode} />
      {/if}
    </div>
  </RenderFor>
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  <TraktPageCoverSetter />

  <RenderForFeature flag={FeatureFlag.Discover}>
    {#snippet enabled()}
      {@render content($mode)}
    {/snippet}

    {@render content()}
  </RenderForFeature>
</TraktPage>

<style>
  .trakt-lists-preview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
