<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import HideIcon from "$lib/components/icons/HideIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";

  const { isGuarded, season, watched, total, onReveal, children }: {
    isGuarded: boolean;
    season: number;
    watched: number;
    total: number;
    onReveal: () => void;
    children: Snippet;
  } = $props();
</script>

<div class="trakt-recap-spoiler-guard" class:is-guarded={isGuarded}>
  <div class="guard-content" inert={isGuarded} aria-hidden={isGuarded}>
    {@render children()}
  </div>

  {#if isGuarded}
    <div class="guard-overlay">
      <div class="guard-card">
        <div class="guard-message">
          <HideIcon />
          <p class="small secondary">
            {#if watched > 0}
              {m.text_recap_spoiler_partial({
                watched,
                total,
                number: season,
              })}
            {:else}
              {m.text_recap_spoiler_unwatched({ number: season })}
            {/if}
          </p>
        </div>

        <Button
          label={m.button_text_recap_show_anyway()}
          style="outline"
          color="default"
          onclick={onReveal}
        >
          {m.button_text_recap_show_anyway()}
        </Button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-recap-spoiler-guard {
    position: relative;

    &.is-guarded {
      max-height: var(--ni-440);
      overflow: hidden;

      .guard-content {
        @include spoiler-blur();

        mask-image: linear-gradient(180deg, black 55%, transparent 100%);

        pointer-events: none;
        user-select: none;
      }
    }

    .guard-overlay {
      position: absolute;
      inset: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      padding: var(--gap-m);
    }

    .guard-card {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);

      box-sizing: border-box;
      width: 100%;
      padding: var(--gap-s);

      border-radius: var(--border-radius-l);
      background: color-mix(
        in srgb,
        var(--color-card-background) 88%,
        transparent
      );
      box-shadow: var(--shadow-raised);
    }

    .guard-message {
      display: flex;
      align-items: center;
      gap: var(--ni-10);

      padding: var(--ni-10) var(--gap-s);

      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);

      :global(svg) {
        flex-shrink: 0;
        width: var(--ni-18);
        height: var(--ni-18);
        color: var(--color-text-emphasis);
      }

      p {
        flex: 1;
        line-height: var(--ni-18);
      }
    }
  }
</style>
