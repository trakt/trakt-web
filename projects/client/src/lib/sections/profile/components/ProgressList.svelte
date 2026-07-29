<script lang="ts">
  import TogglePills from "$lib/components/toggles/TogglePills.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import DrillableMediaList from "$lib/sections/lists/drilldown/DrillableMediaList.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { slide } from "svelte/transition";
  import ProgressItem from "./_internal/progress/ProgressItem.svelte";
  import { useProgressList } from "./_internal/useProgressList.ts";

  const { mode }: { mode: DiscoverMode } = $props();

  const { current, set, options } = useToggler("progress");

  const cta = $derived(
    $current.value === "in-progress" || $current.value === "completed"
      ? {
          type: "progress" as const,
          mediaType: "show" as const,
        }
      : undefined,
  );
</script>

{#snippet subHeader()}
  <TogglePills value={$current.value} onChange={set} {options} />
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
      {subHeader}
    >
      {#snippet item(entry)}
        <ProgressItem {entry} type={$current.value} />
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
