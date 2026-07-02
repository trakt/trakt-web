<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
</script>

<div class="trakt-api-application-detail-skeleton">
  <div class="header">
    <Skeleton width="var(--ni-120)" height="var(--font-size-text-small)" />
    <Skeleton width="50%" height="var(--font-size-title)" />
    <Skeleton width="70%" height="var(--font-size-text)" />
  </div>

  <SettingsGroupCard>
    <div class="body">
      {#each Array(3) as _, index (index)}
        <div class="field">
          <Skeleton width="var(--ni-96)" height="var(--font-size-text-small)" />
          <Skeleton height="var(--ni-24)" radius="var(--border-radius-m)" />
        </div>
      {/each}
    </div>
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-api-application-detail-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    padding: var(--gap-m);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }
</style>
