<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import { useUser } from "$lib/features/auth/stores/useUser";
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import EpisodeProgressItem from "$lib/sections/lists/progress/EpisodeProgressItem.svelte";
  import UpNextLabSwitch from "$lib/sections/lists/progress/UpNextLabSwitch.svelte";
  import { useHiddenShows } from "$lib/sections/lists/progress/useHiddenShows";
  import { useUpNextExperiment } from "$lib/sections/lists/progress/useUpNextExperiment";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList";
  import { useStablePaginated } from "$lib/sections/lists/stores/useStablePaginated";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { type } = useUpNextExperiment();

  const { list: hidden } = $derived(useHiddenShows());

  const { user } = useUser();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-up-next"
  type="episode"
  useList={(params) =>
    useStablePaginated({
      ...params,
      type: "episode",
      useList: (params) => useUpNextList({ type: $type, limit: params.limit }),
      compareFn: (l, r) => l.show.id === r.show.id,
    })}
  urlBuilder={() => UrlBuilder.progress($user?.slug ?? "")}
  title={m.up_next_title()}
>
  {#snippet badge()}
    <UpNextLabSwitch />
  {/snippet}
  {#snippet item(episode)}
    <EpisodeProgressItem
      {episode}
      {style}
      show={episode.show}
      status={$hidden.includes(episode.show.id) ? "hidden" : "watching"}
    />
  {/snippet}
</DrilledMediaList>
