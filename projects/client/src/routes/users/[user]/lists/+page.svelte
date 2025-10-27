<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListRenderer from "$lib/sections/lists/smart/SmartListRenderer.svelte";
  import ListsHeader from "$lib/sections/lists/user/_internal/ListsHeader.svelte";
  import PersonalLists from "$lib/sections/lists/user/PersonalLists.svelte";
  import WatchList from "$lib/sections/lists/watchlist/WatchList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  <TraktPageCoverSetter />

  <WatchList
    drilldownLabel={m.button_label_view_all_watchlist_items()}
    status="all"
  />

  <PersonalLists slug="me" type="personal" />
  <PersonalLists slug="me" type="liked" />
  <PersonalLists slug="me" type="collaboration" />

  <RenderFor audience="director">
    <div class="trakt-lists-preview">
      <ListsHeader title="Smart lists" />
      <SmartListRenderer type="movie" />
      <SmartListRenderer type="show" />
    </div>
  </RenderFor>
</TraktPage>

<style>
  .trakt-lists-preview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
