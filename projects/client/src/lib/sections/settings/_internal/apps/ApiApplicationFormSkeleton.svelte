<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";

  const { title, description }: { title: string; description: string } =
    $props();

  const fields = [
    "var(--ni-40)",
    "var(--ni-80)",
    "var(--ni-96)",
    "var(--ni-80)",
  ];
</script>

<SettingsGroupCard {title} {description}>
  <div class="fields">
    {#each fields as height, index (index)}
      <div class="field">
        <Skeleton width="var(--ni-96)" height="var(--font-size-tag)" />
        <Skeleton {height} radius="var(--border-radius-m)" />
      </div>
    {/each}
  </div>
</SettingsGroupCard>

<style lang="scss">
  .fields {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--gap-m);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }
</style>
