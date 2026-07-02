<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="trakt-settings-group-row-skeleton">
  <Skeleton
    width="var(--ni-36)"
    height="var(--ni-36)"
    radius="var(--border-radius-m)"
  />

  <div class="lines">
    <Skeleton width="40%" height="var(--ni-16)" />
    <Skeleton width="70%" height="var(--ni-12)" />
  </div>
</div>

<style lang="scss">
  .trakt-settings-group-row-skeleton {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    min-height: var(--ni-64);
    padding: var(--gap-s) var(--gap-m);
  }

  .lines {
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
