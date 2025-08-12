<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import { useUser } from "$lib/features/auth/stores/useUser";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useStablePaginated } from "../stores/useStablePaginated";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import UpNextItem from "./UpNextItem.svelte";
  import { useHiddenShows } from "./useHiddenShows";
  import { useUpNextList } from "./useUpNextList";

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
      useList: useUpNextList,
      compareFn: (l, r) => l.show.id === r.show.id,
    })}
  urlBuilder={() => UrlBuilder.progress($user?.slug ?? "")}
  title={m.list_title_up_next()}
  --height-list={mediaListHeightResolver("landscape")}
>
  {#snippet item(episode)}
    <UpNextItem
      style="cover"
      {episode}
      show={episode.show}
      status={$hidden.includes(episode.show.id) ? "hidden" : "watching"}
    />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem cta="up-next" variant="card" />
  {/snippet}

  {#snippet empty()}
    <RenderForFeature flag={FeatureFlag.Cta}>
      {#snippet enabled()}
        <CtaItem cta="up-next" variant="placeholder" />
      {/snippet}

      <p>{m.list_placeholder_up_next_empty()}</p>
    </RenderForFeature>
  {/snippet}
</DrillableMediaList>
