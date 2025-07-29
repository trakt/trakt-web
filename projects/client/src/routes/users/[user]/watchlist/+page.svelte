<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/constants";

  const DISPLAY_PARAM = "display";

  const type = $derived.by(() => {
    switch (page.url.searchParams.get(DISPLAY_PARAM)) {
      case "movie":
        return "movie" as const;
      case "show":
        return "show" as const;
    }
  });

  const handler = (types: MediaType[]) => {
    const url = new URL(page.url);
    const isSingleType = types.length === 1;

    isSingleType
      ? url.searchParams.set(DISPLAY_PARAM, types.at(0) ?? "")
      : url.searchParams.delete(DISPLAY_PARAM);

    goto(url.toString());
  };
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_watchlist()}
>
  <TraktPageCoverSetter />

  <WatchlistPaginatedList
    status="all"
    title={m.list_title_watchlist()}
    {type}
    onTypeChange={handler}
  />
</TraktPage>
