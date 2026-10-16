<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MixtapeActionBarProps } from "./MixtapeActionBarProps.ts";

  const { pickCount, clearHref, mixHref, onMix }: MixtapeActionBarProps =
    $props();
</script>

<div class="trakt-mixtape-action-bar">
  <span class="small secondary no-wrap">
    {pickCount === 0
      ? m.text_mixtape_pick_prompt()
      : m.text_mixtape_pick_count({ count: String(pickCount) })}
  </span>
  <span class="spacer"></span>
  {#if pickCount > 0}
    <Button
      href={clearHref}
      noscroll
      replacestate
      size="small"
      style="ghost"
      variant="secondary"
      label={m.button_text_mixtape_clear()}
    >
      {m.button_text_mixtape_clear()}
    </Button>
  {/if}
  <Button
    href={pickCount > 0 ? mixHref : undefined}
    disabled={pickCount === 0}
    color="purple"
    label={m.button_text_mix_it()}
    onclick={onMix}
  >
    {m.button_text_mix_it()}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-action-bar {
    position: sticky;
    inset-block-end: 0;
    z-index: var(--layer-raised);

    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding: var(--gap-s) var(--layout-distance-side);

    background: var(--color-card-background);
    box-shadow: var(--shadow-floating);

    @include for-tablet-sm-and-below {
      inset-block-end: var(--mobile-navbar-height);
    }

    .spacer {
      flex: 1;
    }
  }
</style>
