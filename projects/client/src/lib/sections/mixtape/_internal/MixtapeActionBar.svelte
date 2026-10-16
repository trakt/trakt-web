<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MixtapeActionBarProps } from "./MixtapeActionBarProps.ts";

  const {
    children,
    pickCount,
    clearHref,
    mixHref,
    onMix,
  }: MixtapeActionBarProps = $props();

  const hasPicks = $derived(pickCount > 0);
  const countText = $derived(
    hasPicks
      ? m.text_mixtape_pick_count({ count: String(pickCount) })
      : m.text_mixtape_pick_prompt(),
  );
</script>

<div
  class="trakt-mixtape-action-bar"
  role="group"
  aria-label={countText}
>
  <div class="action-bar-tray">
    {@render children()}
  </div>
  <footer class="action-bar-footer">
    <span class="small secondary ellipsis action-bar-count">
      {countText}
    </span>
    <div class="action-bar-actions">
      {#if hasPicks}
        <Button
          href={clearHref}
          noscroll
          replacestate
          size="small"
          variant="secondary"
          label={m.button_text_mixtape_clear()}
        >
          {m.button_text_mixtape_clear()}
        </Button>
      {/if}
      <Button
        href={hasPicks ? mixHref : undefined}
        disabled={!hasPicks}
        color="purple"
        size="small"
        label={m.button_text_mix_it()}
        onclick={onMix}
      >
        {m.button_text_mix_it()}
      </Button>
    </div>
  </footer>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-action-bar {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding: var(--gap-xs);

    border-radius: calc(var(--border-radius-m) + var(--gap-xs));
    background: var(--color-card-background);
    box-shadow: var(--shadow-raised);

    .action-bar-footer {
      position: relative;

      display: flex;
      align-items: center;
      gap: var(--gap-s);
      padding-block-start: var(--gap-xs);
      padding-inline-start: var(--gap-xxs);

      &::before {
        @include fading-divider(var(--ni-1));
      }
    }

    .action-bar-count {
      flex: 1;
      min-width: 0;
    }

    .action-bar-actions {
      flex: none;
      display: flex;
      gap: var(--gap-xs);
    }
  }
</style>
