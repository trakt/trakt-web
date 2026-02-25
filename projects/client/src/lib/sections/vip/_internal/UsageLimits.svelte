<script lang="ts">
  import type { UserLimits } from "$lib/requests/models/UserLimits";
  import UsageLimitsCard from "./UsageLimitsCard.svelte";
  import { mapToUsageCategories } from "./utils/mapToUsageCategories";
  import VipContentContainer from "./VipContentContainer.svelte";

  const { limits }: { limits: UserLimits } = $props();

  const categories = $derived(mapToUsageCategories(limits));
</script>

<VipContentContainer>
  <div class="trakt-vip-usage-limits">
    {#each categories as category}
      <UsageLimitsCard items={category.items} title={category.title()} />
    {/each}
  </div>
</VipContentContainer>

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
