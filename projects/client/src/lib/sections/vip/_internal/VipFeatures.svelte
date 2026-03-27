<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ApiIcon from "./icons/ApiIcon.svelte";
  import BookmarkIcon from "./icons/BookmarkIcon.svelte";
  import ChatIcon from "./icons/ChatIcon.svelte";
  import GlobeIcon from "./icons/GlobeIcon.svelte";
  import LibraryIcon from "./icons/LibraryIcon.svelte";
  import ListIcon from "./icons/ListIcon.svelte";
  import NotesIcon from "./icons/NotesIcon.svelte";
  import ProfileIcon from "./icons/ProfileIcon.svelte";
  import RecapsIcon from "./icons/RecapsIcon.svelte";
  import SentimentIcon from "./icons/SentimentIcon.svelte";
  import StreamingIcon from "./icons/StreamingIcon.svelte";
  import SyncIcon from "./icons/SyncIcon.svelte";
  import VipContentContainer from "./VipContentContainer.svelte";
  import VipFeature from "./VipFeature.svelte";
  import VipHeader from "./VipHeader.svelte";

  const vipFeatures = [
    {
      title: m.vip_feature_title_recaps,
      description: m.vip_feature_description_recaps,
      icon: RecapsIcon,
    },
    {
      title: m.vip_feature_title_global_wtw,
      description: m.vip_feature_description_global_wtw,
      icon: GlobeIcon,
    },
    {
      title: m.vip_feature_title_bigger_watchlist,
      description: m.vip_feature_description_bigger_watchlist,
      icon: BookmarkIcon,
    },
    {
      title: m.vip_feature_title_bigger_library,
      description: m.vip_feature_description_bigger_library,
      icon: LibraryIcon,
    },
    {
      title: m.vip_feature_title_profile_customisation,
      description: m.vip_feature_description_profile_customisation,
      icon: ProfileIcon,
    },
    {
      title: m.vip_feature_title_plex_sync,
      description: m.vip_feature_description_plex_sync,
      icon: SyncIcon,
    },
    {
      title: m.vip_feature_title_streaming_services,
      description: m.vip_feature_description_streaming_services,
      icon: StreamingIcon,
    },
    {
      title: m.vip_feature_title_more_lists,
      description: m.vip_feature_description_more_lists,
      icon: ListIcon,
    },
    {
      title: m.vip_feature_title_sentiment_trivia,
      description: m.vip_feature_description_sentiment_trivia,
      icon: SentimentIcon,
    },
    {
      title: m.vip_feature_title_api_apps,
      description: m.vip_feature_description_api_apps,
      icon: ApiIcon,
    },
    {
      title: m.vip_feature_title_private_notes,
      description: m.vip_feature_description_private_notes,
      icon: NotesIcon,
    },
    {
      title: m.vip_feature_title_support,
      description: m.vip_feature_description_support,
      icon: ChatIcon,
    },
  ] as const;
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
    {#each vipFeatures as feature}
      <VipFeature title={feature.title()} description={feature.description()}>
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
