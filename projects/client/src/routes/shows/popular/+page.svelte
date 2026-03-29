<script>
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import PopularPaginatedList from "$lib/sections/lists/popular/PopularPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
</script>

{#snippet actions()}
  <ShareButton
    title={m.list_title_popular_shows()}
    textFactory={({ title: name }) => m.text_share_top_list({ name })}
    source={{ id: "popular", type: "show" }}
  />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_SHOW_COVER}
  title={m.page_title_popular_shows()}
>
  <NavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_most_popular(),
      metaInfo: m.button_text_shows(),
      actions,
    }}
  />

  <TraktPageCoverSetter />

  <PopularPaginatedList type="show" />
</TraktPage>
