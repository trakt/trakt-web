<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import SpoilerSwitch from "$lib/features/spoilers/components/SpoilerSwitch.svelte";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { TriviaCategory } from "$lib/requests/models/MediaTrivia";
  import { fade } from "svelte/transition";
  import { useIsRevampedSummaryHeader } from "../media/header/useIsRevampedSummaryHeader.ts";
  import TriviaBand from "./_internal/TriviaBand.svelte";
  import TriviaCard from "./_internal/TriviaCard.svelte";
  import { useTrivia } from "./useTrivia";

  const { media, onClose }: { media: MediaEntry; onClose: () => void } =
    $props();

  let isOpen = $state(false);

  /* Behind the revamped headers, each fact is a band in their language. */
  const isRevampedHeader = useIsRevampedSummaryHeader();
  let activeCategory = $state<TriviaCategory | "all">("all");

  const { current: triviaType, set } = useToggler("trivia");

  /* Spoilers on shows only the spoiler facts; the category menu stays in
     place, dimmed, rather than vanishing under it. */
  const isSpoilers = $derived($triviaType.value === "spoilers");

  const { list, hasSpoilers, categories } = $derived(
    useTrivia({
      slug: media.slug,
      type: media.type,
      variant: $triviaType.value,
    }),
  );

  const effectiveCategory = $derived(
    activeCategory !== "all" && !$categories.includes(activeCategory)
      ? ("all" as const)
      : activeCategory,
  );

  const filteredList = $derived(
    effectiveCategory === "all" || isSpoilers
      ? $list
      : $list.filter((trivia) => trivia.category === effectiveCategory),
  );

  const categoryOptions = $derived([
    { value: "all", label: m.option_text_trivia_category_all() },
    ...$categories
      .map((category) => ({
        value: category,
        label: categoryLabel(category),
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ]);

  function categoryLabel(category: TriviaCategory): string {
    switch (category) {
      case "bts":
        return m.option_text_trivia_category_bts();
      case "cast_n_crew":
        return m.option_text_trivia_category_cast_n_crew();
      case "story_n_themes":
        return m.option_text_trivia_category_story_n_themes();
      case "impact_n_legacy":
        return m.option_text_trivia_category_impact_n_legacy();
      case "real_world_connections":
        return m.option_text_trivia_category_real_world_connections();
    }
  }
</script>

<!-- The count stays beside the title; the filters take their own row under
     it, so the title is never squeezed out by them. -->
{#snippet badge()}
  <span class="trivia-count">{$list.length}</span>
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_trivia()}
  variant="vip"
  size="auto"
  {badge}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="vip">
        {#if $hasSpoilers || $categories.length > 1}
          <div class="trivia-filters">
            {#if $hasSpoilers}
              <SpoilerSwitch
                isChecked={isSpoilers}
                label={m.button_label_trivia_spoilers()}
                onclick={() => set(isSpoilers ? "no-spoilers" : "spoilers")}
              />
            {/if}
            {#if $categories.length > 1}
              <SingleSelect
                options={categoryOptions}
                value={effectiveCategory === "all" ? null : effectiveCategory}
                placeholder={m.option_text_trivia_category_all()}
                autoWidth
                variant="pill"
                disabled={isSpoilers}
                onChange={(value) =>
                  (activeCategory = value as TriviaCategory | "all")}
              />
            {/if}
          </div>
        {/if}

        <div class="trivia-drawer-list">
          {#each filteredList as trivia (trivia.key)}
            {#if $isRevampedHeader}
              <TriviaBand
                {trivia}
                {media}
                categoryLabel={categoryLabel(trivia.category)}
              />
            {:else}
              <TriviaCard {trivia} {media} />
            {/if}
          {/each}
        </div>
      </RenderFor>

      <RenderFor audience="free">
        <UpsellCta source="trivia">
          {m.vip_feature_description_trivia()}
        </UpsellCta>
      </RenderFor>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .trivia-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs);

    padding-block-end: var(--ni-16);
  }

  .trivia-count {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    color: var(--color-text-secondary);
  }

  .trivia-drawer-list {
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);

    padding-block-end: var(--gap-s);

    :global(.trakt-trivia-band + .trakt-trivia-band) {
      padding-top: var(--ni-20);
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }
</style>
