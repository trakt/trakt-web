<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import RetryIcon from "$lib/components/icons/RetryIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartListDraftsSummary } from "$lib/requests/models/SmartListDraftsSummary.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import SmartListNudgeRow from "./SmartListNudgeRow.svelte";
  import { toNudgeMessage } from "./toNudgeMessage.ts";

  const {
    summary,
    onDismiss,
  }: { summary: SmartListDraftsSummary; onDismiss: () => void } = $props();

  const rowsId = $props.id();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  let isExpanded = $state(false);

  const toggleText = $derived(
    isExpanded ? m.button_text_hide_lists() : m.button_text_review_lists(),
  );

  const message = $derived(
    toNudgeMessage({ count: summary.convertibleCount, isMobile: $isMobile }),
  );
</script>

<section class="trakt-smart-list-nudge-bar" class:is-expanded={isExpanded}>
  <div class="bar-header">
    <span class="bar-icon" aria-hidden="true"><RetryIcon /></span>

    <p class="bar-message bold ellipsis">{message}</p>

    <div class="bar-actions">
      <Button
        size="small"
        variant="secondary"
        color="purple"
        type="button"
        label={toggleText}
        aria-expanded={isExpanded}
        aria-controls={rowsId}
        onclick={() => (isExpanded = !isExpanded)}
      >
        {toggleText}
      </Button>

      {#if $isMobile}
        <ActionButton
          onclick={onDismiss}
          label={m.button_text_not_now()}
          size="small"
          style="ghost"
        >
          <CloseIcon />
        </ActionButton>
      {:else}
        <Button
          size="small"
          variant="secondary"
          color="default"
          type="button"
          label={m.button_text_not_now()}
          onclick={onDismiss}
        >
          {m.button_text_not_now()}
        </Button>
      {/if}
    </div>
  </div>

  {#if isExpanded}
    <ul id={rowsId} class="bar-rows">
      {#each summary.lists as list (list.slug)}
        <SmartListNudgeRow {list} />
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-nudge-bar {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    box-sizing: border-box;
    margin-inline: var(--layout-distance-side);
    margin-bottom: var(--gap-m);
    padding: var(--gap-xs) var(--gap-m);

    background: var(--color-card-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-floating);
  }

  .bar-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    min-height: var(--ni-44);
  }

  .bar-icon {
    flex-shrink: 0;

    display: grid;
    place-items: center;

    color: var(--color-text-emphasis);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .bar-message {
    flex: 1 1 auto;
    min-width: 0;
  }

  .bar-actions {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .bar-rows {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--ni-480)), 1fr));
    gap: var(--gap-s);

    padding: var(--gap-xs) 0 var(--gap-s);
  }
</style>
