<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_FEATURES } from "./VIP_FEATURES";
  import VipContentContainer from "./VipContentContainer.svelte";
  import VipFeature from "./VipFeature.svelte";
  import VipHeader from "./VipHeader.svelte";
</script>

<VipContentContainer>
  {#snippet header()}
    <VipHeader>
      Here's what you get <strong>more</strong> of with <VipBadge
        size="large"
      />

      {#snippet description()}
        <span class="secondary">{m.text_vip_features_tagline()}</span>
      {/snippet}
    </VipHeader>
  {/snippet}

  <div class="trakt-vip-features">
    {#each VIP_FEATURES as feature, index (feature.title)}
      <VipFeature
        title={feature.title()}
        description={feature.description()}
        delay={(index % 3) * 80}
      >
        {#snippet icon()}
          <svelte:component this={feature.icon} />
        {/snippet}
      </VipFeature>
    {/each}
  </div>
</VipContentContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-features {
    position: relative;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
    gap: var(--gap-l);

    transition: gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      grid-template-columns: repeat(2, 1fr);
    }

    @include for-mobile {
      grid-template-columns: 1fr;
      gap: var(--gap-m);
    }
  }
</style>
