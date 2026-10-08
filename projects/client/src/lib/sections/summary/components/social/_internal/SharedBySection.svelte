<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RecommendedBy } from "$lib/requests/models/RecommendedBy.ts";
  import SharedByAvatar from "./SharedByAvatar.svelte";

  type SharedBySectionProps = {
    recommendedBy: RecommendedBy;
    isMuting: boolean;
    onMute: (sharerId: number) => void;
  };

  const { recommendedBy, isMuting, onMute }: SharedBySectionProps = $props();
</script>

<section class="trakt-shared-by-section">
  <h6>{m.list_title_shared_by()}</h6>

  <div class="shared-by-avatars">
    {#each recommendedBy.users as user (user.key)}
      <SharedByAvatar {user} {isMuting} {onMute} />
    {/each}

    {#if recommendedBy.otherCount > 0}
      <span class="shared-by-other-count secondary bold">
        +{recommendedBy.otherCount}
      </span>
    {/if}
  </div>
</section>

<style lang="scss">
  .trakt-shared-by-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding-block-start: var(--gap-m);
    border-block-start: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 40%, transparent);

    &:first-child {
      padding-block-start: 0;
      border-block-start: none;
    }
  }

  .shared-by-avatars {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs);
    min-height: var(--ni-44);
  }
</style>
