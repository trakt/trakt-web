<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { TriviaCategory } from "$lib/requests/models/MediaTrivia";
  import { fade } from "svelte/transition";
  import TriviaCard from "./_internal/TriviaCard.svelte";
  import { useTrivia } from "./useTrivia";

  const { media, onClose }: { media: MediaEntry; onClose: () => void } =
    $props();

  let isOpen = $state(false);
  let activeCategory = $state<TriviaCategory | "all">("all");

  const { current: triviaType, set, options } = useToggler("trivia");

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

{#snippet badge()}
  <div class="trivia-badge">
    <span class="trivia-count">{$list.length}</span>
    {#if $hasSpoilers}
      <Toggler value={$triviaType.value} onChange={set} {options} />
    {/if}
  </div>
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
        {#if $categories.length > 1}
          <div class="category-pills">
            {#each categoryOptions as option (option.value)}
              <Button
                color={effectiveCategory === option.value ||
                    (option.value === "all" && effectiveCategory === "all")
                  ? "purple"
                  : "default"}
                style={effectiveCategory === option.value ? "flat" : "outline"}
                size="small"
                label={option.label}
                onclick={() =>
                  (activeCategory = option.value as TriviaCategory | "all")}
              >
                {option.label}
              </Button>
            {/each}
          </div>
        {/if}

        <div class="trivia-drawer-list">
          {#each filteredList as trivia (trivia.key)}
            <TriviaCard
              {trivia}
              {media}
              categoryLabel={categoryLabel(trivia.category)}
            />
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
  .trivia-badge {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .trivia-count {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    color: var(--color-text-secondary);
  }

  .category-pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-s);

    /* The pills rule off from the facts below, as the header does its bands. */
    padding: var(--gap-xs) var(--gap-s) var(--ni-20);
    margin-bottom: var(--ni-20);
    border-bottom: var(--ni-1) solid var(--color-hairline);
  }

  .trivia-drawer-list {
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);

    /* The sentiment drawer's supplemental prose inset - one tuning. */
    padding: 0 var(--gap-s) var(--gap-s);

    :global(.trakt-trivia-card + .trakt-trivia-card) {
      padding-top: var(--ni-20);
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }
</style>
