<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";

  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListRenderer from "$lib/sections/lists/smart/SmartListRenderer.svelte";
  import ListsHeader from "$lib/sections/lists/user/_internal/ListsHeader.svelte";
  import PersonalLists from "$lib/sections/lists/user/PersonalLists.svelte";
  import WatchList from "$lib/sections/lists/watchlist/WatchList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { mode } = useDiscover();
  const { user } = useUser();

  const { isMe } = $derived(useIsMe(params.user));
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  {#if !$isMe}
    <Redirect to={UrlBuilder.profile.user(params.user)} />
  {/if}

  <TraktPageCoverSetter />

  <NavbarStateSetter hasFilters>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>

  <WatchList
    drilldownLabel={m.button_label_view_all_watchlist_items()}
    type={$mode}
  />

  <PersonalLists slug={$user.slug} type="personal" mode={$mode} />
  <PersonalLists slug={$user.slug} type="liked" mode={$mode} />
  <PersonalLists slug={$user.slug} type="collaboration" mode={$mode} />

  <RenderFor audience="director">
    <div class="trakt-lists-preview">
      <ListsHeader title="Smart lists" />

      {#if $mode === "media" || !mode}
        <SmartListRenderer type="movie" />
        <SmartListRenderer type="show" />
      {:else}
        <SmartListRenderer type={$mode} />
      {/if}
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
