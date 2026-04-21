<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import DropNotePromptProvider from "$lib/sections/media-actions/drop/DropNotePromptProvider.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useStablePaginated } from "../stores/useStablePaginated";
  import ContinueWatchingItem from "./_internal/ContinueWatchingItem.svelte";
  import { useUpNextList } from "./useUpNextList";

  const { user } = useUser();
  const { mode } = useDiscover();

  const cta = $derived({
    type: "up-next" as const,
    mediaType: $mode === "media" ? undefined : $mode,
  });

  const { filterMap } = useFilter();
</script>

<DropNotePromptProvider>
  <DrillableMediaList
    type={$mode}
    id={`up-next-list-${$mode}`}
    source={{
      id: "up-next",
    }}
    drilldownLabel="drill label"
    filter={$filterMap}
    useList={(listParams) =>
      useStablePaginated({
        ...listParams,
        useList: useUpNextList,
        compareFn: (l, r) => {
          const isComparingEpisodes = "show" in l && "show" in r;
          return isComparingEpisodes ? l.show.id === r.show.id : l.id === r.id;
        },
      })}
    urlBuilder={() => UrlBuilder.progress($user?.slug ?? "")}
    title={m.list_title_up_next()}
    variant="landscape"
  >
    {#snippet item(progressEntry)}
      <ContinueWatchingItem entry={progressEntry} style="cover" />
    {/snippet}

    {#snippet ctaItem()}
      <CtaItem {cta} variant="card" />
    {/snippet}

    {#snippet empty()}
      <CtaItem {cta} variant="placeholder" />
    {/snippet}
  </DrillableMediaList>
</DropNotePromptProvider>
