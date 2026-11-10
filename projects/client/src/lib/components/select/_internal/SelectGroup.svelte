<script lang="ts">
  import { Select } from "bits-ui";
  import type { Snippet } from "svelte";

  const { label, children }: { label: string; children: Snippet } = $props();
</script>

<Select.Group class="trakt-select-group">
  <Select.GroupHeading class="trakt-select-group-heading">
    <span class="tag secondary uppercase">{label}</span>
  </Select.GroupHeading>
  {@render children()}
</Select.Group>

<style lang="scss">
  :global(.trakt-select-group) {
    --select-group-release: var(--ni-40);

    display: flex;
    flex-direction: column;
  }

  :global(.trakt-select-group + .trakt-select-group) {
    margin-block-start: var(--ni-8);
  }

  :global(.trakt-select-group-heading) {
    position: sticky;
    top: 0;
    z-index: var(--layer-raised);

    margin-block-end: var(--select-group-release);
    padding: var(--ni-4) var(--ni-12);

    background-color: var(--color-floating-surface);
  }

  :global(.trakt-select-group-heading + *) {
    margin-block-start: calc(-1 * var(--select-group-release));
  }
</style>
