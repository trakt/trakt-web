<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  const { url, code }: { url: string; code: string } = $props();
</script>

<div class="trakt-manual-sign-in">
  <div class="trakt-manual-sign-in-detail">
    <h5>{m.code_instruction()}</h5>
    <h4>{url}</h4>
  </div>
  <div class="trakt-manual-sign-in-detail">
    <h5>{m.code_label()}</h5>
    <h1>{code}</h1>
  </div>
</div>

<style>
  .trakt-manual-sign-in {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-l);
  }

  .trakt-manual-sign-in-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h5 {
      color: var(--color-text-secondary);
    }
  }
</style>
