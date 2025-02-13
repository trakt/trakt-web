<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import SocialActivityCard from "./SocialActivityCard.svelte";
  import { useSocialActivity } from "./useSocialActivity";

  const { list, isLoading } = useSocialActivity();

  const hasSocialActivity = $derived(!$isLoading && $list.length > 0);
</script>

<!-- TODO replace with empty state message when actionable on Trakt Lite -->
{#if hasSocialActivity}
  <SectionList
    id="social-activity-list"
    items={$list}
    title={m.social_activity_title()}
    --height-list={mediaListHeightResolver("episode")}
  >
    {#snippet item(entry)}
      <SocialActivityCard {entry} />
    {/snippet}
  </SectionList>
{/if}
