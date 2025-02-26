<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import { useUser } from "$lib/features/auth/stores/useUser";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useStablePaginated } from "../stores/useStablePaginated";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import EpisodeProgressItem from "./EpisodeProgressItem.svelte";
  import UpNextLabSwitch from "./UpNextLabSwitch.svelte";
  import { useHiddenShows } from "./useHiddenShows";
  import { useUpNextExperiment } from "./useUpNextExperiment";
  import { useUpNextList } from "./useUpNextList";

  const { type } = useUpNextExperiment();

  const { list: hidden } = $derived(useHiddenShows());

  const { user } = useUser();
</script>

<DrillableMediaList
  type="episode"
  id="up-next-list"
  drilldownLabel={"drill label"}
  useList={() =>
    useStablePaginated({
      type: "episode",
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      useList: (props) => useUpNextList({ ...props, type: $type }),
      compareFn: (l, r) => l.show.id === r.show.id,
    })}
  urlBuilder={() => UrlBuilder.progress($user?.slug ?? "")}
  title={m.up_next_title()}
  --height-list={mediaListHeightResolver("episode")}
>
  {#snippet badge()}
    <UpNextLabSwitch />
  {/snippet}
  {#snippet item(episode)}
    <EpisodeProgressItem
      style="cover"
      {episode}
      show={episode.show}
      status={$hidden.includes(episode.show.id) ? "hidden" : "watching"}
    />
  {/snippet}
</DrillableMediaList>
