<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import HourglassIcon from "$lib/components/icons/HourglassIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import { useToggler } from "$lib/components/toggles/useToggler.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import DrillableMediaList from "$lib/sections/lists/drilldown/DrillableMediaList.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { slide } from "svelte/transition";
  import ProgressItem from "./_internal/progress/ProgressItem.svelte";
  import { useProgressList } from "./_internal/useProgressList.ts";

  const { mode }: { mode: DiscoverMode } = $props();

  const { current, set, options } = useToggler("progress");

  const progressOptions = $derived(
    options.map((option) => ({ value: option.value, label: option.text() })),
  );

  const cta = $derived(
    $current.value === "in-progress" || $current.value === "completed"
      ? {
          type: "progress" as const,
          mediaType: "show" as const,
        }
      : undefined,
  );
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={$current.text()} />
{/snippet}

{#snippet progressIcon(option: SelectOption)}
  {#if option.value === "completed"}<TrackIcon />{/if}
  {#if option.value === "in-progress"}<HourglassIcon />{/if}
  {#if option.value === "dropped"}<DropIcon />{/if}
{/snippet}

{#if mode !== "movie"}
  <div class="trakt-progress-list-wrapper" transition:slide={{ duration: 500 }}>
    <DrillableMediaList
      --height-override-card="var(--height-portrait-card-sm)"
      --height-override-list="var(--height-poster-list-sm)"
      id={{
        scope: "progress-list",
        key: $current.value,
      }}
      source={{ id: "progress", type: $current.value }}
      title={m.list_title_progress()}
      drilldownLabel={m.button_label_view_all_progress()}
      type="show"
      useList={() => useProgressList({ type: $current.value })}
      urlBuilder={() => UrlBuilder.profile.progress("me")}
      {metaInfo}
    >
      {#snippet item(entry)}
        <ProgressItem {entry} type={$current.value} />
      {/snippet}

      {#snippet actions()}
        <SegmentedSelect
          variant="compact"
          options={progressOptions}
          value={$current.value}
          ariaLabel={m.list_title_progress()}
          icon={progressIcon}
          onChange={(value) => set(value as Parameters<typeof set>[0])}
        />
      {/snippet}

      {#snippet ctaItem()}
        {#if cta}
          <CtaItem {cta} variant="card" />
        {/if}
      {/snippet}

      {#snippet empty()}
        {#if cta}
          <CtaItem {cta} variant="placeholder" />
        {:else if $current.value === "dropped"}
          <p class="secondary">
            {m.list_placeholder_dropped_shows()}
          </p>
        {/if}
      {/snippet}
    </DrillableMediaList>
  </div>
{/if}
