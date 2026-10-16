<script lang="ts">
  import MatchIcon from "$lib/components/icons/MatchIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { match }: { match: number } = $props();
</script>

<div class="trakt-mixtape-match-tag">
  <MatchIcon />
  <span>{m.tag_mixtape_match({ match: String(match) })}</span>
</div>

<style lang="scss">
  .trakt-mixtape-match-tag {
    display: flex;
    align-items: center;
    gap: var(--ni-4);
    padding: var(--ni-4) var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--shade-940) 72%, transparent);
    backdrop-filter: blur(var(--ni-6));
    color: var(--shade-10);

    font-size: var(--font-size-text-small);
    font-weight: 700;
    white-space: nowrap;
  }
</style>
