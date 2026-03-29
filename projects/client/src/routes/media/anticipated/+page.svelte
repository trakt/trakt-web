<script>
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import AnticipatedPaginatedList from "$lib/sections/lists/anticipated/AnticipatedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
</script>

{#snippet actions()}
  <ShareButton
    title={m.list_title_most_anticipated()}
    textFactory={({ title: name }) => m.text_share_top_list({ name })}
    source={{ id: "anticipated", type: "media" }}
  />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_anticipated_media()}
>
  <NavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_most_anticipated(),
      metaInfo: m.button_text_media(),
      actions,
    }}
  />

  <TraktPageCoverSetter />

  <AnticipatedPaginatedList type="media" />
</TraktPage>
