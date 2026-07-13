<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import StemTag from "../tags/StemTag.svelte";
  import Tooltip from "../tooltip/Tooltip.svelte";
</script>

<Tooltip content={m.label_queued_action()}>
  <div class="trakt-queued-tag" role="status" aria-label={m.label_queued_action()}>
    <StemTag
      --color-background-stem-tag="var(--color-background-queued-tag)"
      --color-foreground-stem-tag="var(--color-text-queued-tag)"
      text={m.tag_text_queued()}
    />
  </div>
</Tooltip>

<style>
  .trakt-queued-tag {
    user-select: none;
  }
</style>
