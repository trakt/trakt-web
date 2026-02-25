<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrownIcon from "./icons/CrownIcon.svelte";
  import EarlyAccessIcon from "./icons/EarlyAccessIcon.svelte";
  import IncreasedLimitsIcon from "./icons/IncreasedLimitsIcon.svelte";
  import MirIcon from "./icons/MirIcon.svelte";
  import SentimentIcon from "./icons/SentimentIcon.svelte";
  import TraktIcon from "./icons/TraktIcon.svelte";
  import TriviaIcon from "./icons/TriviaIcon.svelte";
  import YirIcon from "./icons/YirIcon.svelte";
  import VipFeature from "./VipFeature.svelte";
  import VipHeader from "./VipHeader.svelte";

  const VIP_FEATURES = [
    {
      title: m.vip_feature_title_yir,
      description: m.vip_feature_description_yir,
      icon: YirIcon,
    },
    {
      title: m.vip_feature_title_mir,
      description: m.vip_feature_description_mir,
      icon: MirIcon,
    },
    {
      title: m.vip_feature_title_vip_status,
      description: m.vip_feature_description_vip_status,
      icon: CrownIcon,
    },
    {
      title: m.vip_feature_title_early_access,
      description: m.vip_feature_description_early_access,
      icon: EarlyAccessIcon,
    },
    {
      title: m.vip_feature_title_increased_limits,
      description: m.vip_feature_description_increased_limits,
      icon: IncreasedLimitsIcon,
    },
    {
      title: m.vip_feature_title_sentiment,
      description: m.vip_feature_description_sentiment,
      icon: SentimentIcon,
    },
    {
      title: m.vip_feature_title_trivia,
      description: m.vip_feature_description_trivia,
      icon: TriviaIcon,
    },
    {
      title: m.vip_feature_title_more_to_come,
      description: m.vip_feature_description_more_to_come,
      icon: TraktIcon,
    },
  ] as const;
</script>

<div class="trakt-vip-features-content">
  <VipHeader>
    Here's what you get with <VipBadge />

    {#snippet description()}
      <span class="secondary">{m.text_vip_features_tagline()}</span>
    {/snippet}
  </VipHeader>

  <div class="trakt-vip-features">
    {#each VIP_FEATURES as feature}
      <VipFeature title={feature.title()} description={feature.description()}>
        {#snippet icon()}
          <svelte:component this={feature.icon} />
        {/snippet}
      </VipFeature>
    {/each}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-features-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xl);
  }

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
