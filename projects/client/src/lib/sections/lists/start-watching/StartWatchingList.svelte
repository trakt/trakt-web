<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import WatchlistItem from "../watchlist/WatchlistItem.svelte";
  import { useStartWatchingList } from "./_internal/useStartWatchingList";

  const { mode } = useDiscover();
  const { user } = useUser();
</script>

<DrillableMediaList
  id={`start-watching-list-${$mode}`}
  source={{ id: "start-watching", type: $mode }}
  title={m.list_title_start_watching()}
  drilldownLabel={m.button_label_view_all_start_watching()}
  type={$mode}
  useList={useStartWatchingList}
  urlBuilder={() => UrlBuilder.startWatching($user?.slug ?? "")}
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} />
  {/snippet}
</DrillableMediaList>
