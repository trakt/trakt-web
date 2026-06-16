<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { fade } from "svelte/transition";
  import { useSocialActivities } from "../_internal/useSocialActivities.ts";
  import SocialActivityRow from "./_internal/SocialActivityRow.svelte";
  import SocialActivitySummaryHeader from "./_internal/SocialActivitySummaryHeader.svelte";

  type SocialDrawerHostProps = {
    target: MediaSocialQueryTarget;
    title: string;
    onClose: () => void;
  };

  const { target, title, onClose }: SocialDrawerHostProps = $props();

  const target$ = fromRune(() => target);
  const { entries: socialEntries, isLoading } = useSocialActivities(target$, {
    mode: "all",
  });

  const hasEntries = $derived($socialEntries.length > 0);
  const activityCount = $derived($socialEntries.length);
  const ratings = $derived.by(() => {
    return $socialEntries
      .map((entry) => entry.watched?.rating?.rating)
      .filter((rating): rating is number => rating != null);
  });

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_social_activity()}
  metaInfo={title}
  size="auto"
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="authenticated">
        <div class="trakt-social-activity-drawer">
          {#if $isLoading && !hasEntries}
            <LoadingIndicator />
          {/if}

          {#if !$isLoading && !hasEntries}
            <p class="social-activity-placeholder">
              {m.text_social_activities_placeholder()}
            </p>
          {/if}

          {#if hasEntries}
            <div class="trakt-social-activity-section">
              <SocialActivitySummaryHeader {activityCount} {ratings} />

              <ul class="trakt-social-activity-list">
                {#each $socialEntries as entry (entry.key)}
                  <SocialActivityRow {entry} />
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </RenderFor>
    </div>
  {/if}
</Drawer>

<style>
  .trakt-social-activity-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .social-activity-placeholder {
    color: var(--color-text-secondary);
    padding-block: var(--gap-s);
  }

  .trakt-social-activity-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-social-activity-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
