<script lang="ts">
  import type { MessageBanner } from "$lib/features/promotions/models/Promotion";
  import DismissButton from "../_internal/DismissButton.svelte";

  const {
    onDismiss,
    promotion,
  }: { onDismiss: () => void; promotion: MessageBanner } = $props();
</script>

<div class="trakt-message-banner">
  <span class="trakt-message-banner-text">{promotion.message}</span>
  <DismissButton {onDismiss} />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-message-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    color: var(--shade-10);

    min-height: var(--ni-56);

    padding: var(--ni-12) var(--ni-18);
    box-sizing: border-box;

    background: var(--shade-800);
    border-radius: var(--border-radius-l);
  }

  .trakt-message-banner-text {
    font-size: var(--ni-14);
    line-height: var(--line-height-body);
  }
</style>
