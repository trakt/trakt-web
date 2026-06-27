<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { TriviaCategory } from "$lib/requests/models/MediaTrivia";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { fade } from "svelte/transition";
  import TriviaCard from "./_internal/TriviaCard.svelte";
  import { useTrivia } from "./useTrivia";

  const characterWidthFactor = 0.85;

  const { media, onClose }: { media: MediaEntry; onClose: () => void } =
    $props();

  let isOpen = $state(false);
  let activeCategory = $state<TriviaCategory | "all">("all");

  const { current: triviaType, set, options } = useToggler("trivia");

  const longestOptionLength = $derived(
    Math.max(...options.map((option) => option.text().length)),
  );

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
    effectiveCategory === "all"
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

{#snippet metaInfo()}
  <ListMetaInfo
    text={$triviaType.text()}
    --meta-info-width={`${longestOptionLength * characterWidthFactor}ch`}
  />
{/snippet}

{#snippet badge()}
  {#if $hasSpoilers || $categories.length > 1}
    <div class="trivia-controls">
      {#if $hasSpoilers}
        <Toggler value={$triviaType.value} onChange={set} {options} />
      {/if}
      {#if $categories.length > 1}
        <div class="category-filter">
          <SingleSelect
            options={categoryOptions}
            value={effectiveCategory === "all" ? null : effectiveCategory}
            placeholder={m.option_text_trivia_category_all()}
            autoWidth
            onChange={(value) =>
              (activeCategory = value as TriviaCategory | "all")}
          />
        </div>
      {/if}
    </div>
  {/if}
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_trivia()}
  variant="vip"
  size="auto"
  metaInfo={$hasSpoilers ? metaInfo : undefined}
  {badge}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="vip">
        <div class="trivia-drawer-list">
          {#each filteredList as trivia (trivia.key)}
            <TriviaCard {trivia} {media} />
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

<style>
  .trivia-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    flex: 1;
    min-width: 0;
  }

  .category-filter {
    display: flex;
    margin-inline-start: auto;
    min-width: 0;
  }

  .trivia-drawer-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-2);
  }
</style>
