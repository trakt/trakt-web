<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="trakt-plex-profile-picker-skeleton">
  <Skeleton width="40%" height="var(--ni-16)" />
  <div class="tiles">
    {#each { length: 4 }, index (index)}
      <Skeleton width="var(--ni-64)" height="var(--ni-64)" radius="50%" />
    {/each}
  </div>
</div>

<style lang="scss">
  .trakt-plex-profile-picker-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .tiles {
    display: flex;
    gap: var(--gap-m);

    padding: var(--gap-xs);
  }
</style>
