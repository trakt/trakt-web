<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import AchievementCard from "./AchievementCard.svelte";
  import type { AchievementCategorySectionProps } from "./AchievementCategorySectionProps.ts";

  const { section, revealOrder, isOpen, onToggle }:
    AchievementCategorySectionProps = $props();

  const bodyId = $derived(`achievement-category-${section.id}`);
  const counts = $derived({
    unlocked: section.unlockedCount,
    total: section.totalCount,
  });
</script>

<section class="trakt-achievement-category-section" class:is-open={isOpen}>
  <h3 class="section-heading">
    <button
      type="button"
      class="section-toggle"
      aria-expanded={isOpen}
      aria-controls={bodyId}
      onclick={onToggle}
    >
      <span class="section-title bold">{section.title}</span>
      <span class="section-count" aria-hidden="true">
        {m.vip_achievements_anchor_label(counts)}
      </span>
      <span class="section-count-label">{m.vip_achievements_count(counts)}</span>
      <span class="section-caret">
        <CaretRightIcon />
      </span>
    </button>
  </h3>

  <div id={bodyId} class="section-body" inert={!isOpen}>
    <div class="section-cards">
      {#each section.achievements as achievement (achievement.id)}
        <AchievementCard
          {achievement}
          revealIndex={revealOrder.get(achievement.id) ?? null}
        />
      {/each}
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-achievement-category-section {
    display: flex;
    flex-direction: column;
  }

  .section-heading {
    margin: 0;
    font-size: inherit;
  }

  .section-toggle {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    inline-size: calc(100% + var(--ni-12) * 2);
    padding: var(--ni-10) var(--ni-12);
    margin-inline: calc(var(--ni-12) * -1);
    border-radius: var(--border-radius-m);

    color: var(--color-text-primary);
    transition: background-color var(--transition-increment) ease-out;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
    }

    @include for-mouse {
      &:hover {
        background: color-mix(
          in srgb,
          var(--color-foreground) 6%,
          transparent
        );
      }
    }
  }

  .section-title {
    font-size: var(--font-size-text);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .section-count {
    font-size: var(--font-size-tag);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-secondary);
  }

  .section-count-label {
    @include visually-hidden;
  }

  .section-caret {
    display: inline-flex;
    margin-inline-start: auto;
    color: var(--color-text-secondary);
    transform: rotate(calc(var(--rtl-sign) * 90deg));
    transition: transform var(--transition-increment) ease-in-out;

    .is-open & {
      transform: rotate(calc(var(--rtl-sign) * -90deg));
    }

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }

  .section-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--transition-increment) ease-in-out;

    .is-open & {
      grid-template-rows: 1fr;
    }
  }

  .section-cards {
    min-height: 0;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .is-open & {
      padding-block: var(--ni-4) var(--ni-8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .section-toggle,
    .section-caret,
    .section-body {
      transition: none;
    }
  }
</style>
