<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  const { name }: { name: string } = $props();
</script>

<span class="trakt-yir-hybrid-stamp">
  <i aria-hidden="true"></i>
  {m.yir_2026_hybrid({ persona: name })}
</span>

<style>
  .trakt-yir-hybrid-stamp {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--ni-6) var(--ni-12) var(--ni-6) var(--ni-6);
    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid var(--color-yir-accent);
    background: color-mix(in srgb, var(--color-yir-accent) 14%, transparent);
    color: var(--color-yir-text-primary);
    font-size: var(--font-size-tag);
  }

  i {
    width: var(--ni-16);
    height: var(--ni-16);
    border-radius: 50%;
    background: var(--color-yir-accent);
  }
</style>
