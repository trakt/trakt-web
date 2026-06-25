<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import UsageLimitsCard from "./UsageLimitsCard.svelte";
  import { mapToUsageCategories } from "./utils/mapToUsageCategories";

  const { limits } = useUser();

  const categories = $derived(mapToUsageCategories($limits));
</script>

<div class="trakt-vip-usage-limits">
  {#each categories as category, index (index)}
    <UsageLimitsCard
      items={category.items}
      title={category.title()}
      isLoading={!$limits}
      style="compact"
    />
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-usage-limits {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    transition: gap var(--transition-increment) ease-in-out;

    @include for-mobile {
      gap: var(--gap-m);
    }
  }
</style>
