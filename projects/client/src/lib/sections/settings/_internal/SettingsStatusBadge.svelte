<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";

  const { label }: { label: string } = $props();
</script>

<span class="trakt-settings-status-badge bold tag">
  <CheckIcon />
  {label}
</span>

<style lang="scss">
  .trakt-settings-status-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);
    flex-shrink: 0;

    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xl);

    background: color-mix(in srgb, var(--green-500) 10%, transparent);
    color: var(--green-500);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }
  }
</style>
