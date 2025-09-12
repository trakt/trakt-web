<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import WatchlistTag from "./_internal/WatchlistTag.svelte";
  import { statusToStore } from "./statusToStore";
  import WatchlistItem from "./WatchlistItem.svelte";

  type WatchListProps = {
    type?: MediaType;
    drilldownLabel: string;
    empty?: Snippet;
    status: "all" | "released" | "unreleased";
  };

  const {
    type: externalType,
    status,
    drilldownLabel,
  }: WatchListProps = $props();
  const { filterMap } = useFilter();

  const useList = $derived.by(() => statusToStore(status));

  const { current: selectedType, set, options } = useToggler("media");

  const type = $derived.by(() => {
    if (externalType) {
      return externalType;
    }

    return $selectedType === "all" ? undefined : $selectedType;
  });

  const cta = $derived(
    status === "all"
      ? { type: "watchlist" as const, mediaType: type }
      : { type: status },
  );
</script>

<DrillableMediaList
  id="watch-list-{type}-{status}"
  title={m.list_title_watchlist()}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {useList}
  urlBuilder={({ type, ...rest }) => {
    if (status === "all") {
      return UrlBuilder.lists.watchlist();
    }

    return UrlBuilder.lists.user({
      type: assertDefined(type),
      ...rest,
      status,
    });
  }}
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}

  {#snippet badge()}
    {#if status === "all"}
      <Toggler value={$selectedType} onChange={set} {options} />
    {/if}

    {#if status === "unreleased" || status === "released"}
      <WatchlistTag {status} />
    {/if}
  {/snippet}
</DrillableMediaList>
