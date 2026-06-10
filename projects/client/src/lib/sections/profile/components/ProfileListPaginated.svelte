<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { getProfileSocialPlaceholder } from "../_internal/getProfileSocialPlaceholder";
  import type { ProfileSocialListType } from "../models/ProfileSocialListType";
  import { useFollowing } from "../stores/useFollowing";
  import ProfileCard from "./ProfileCard.svelte";

  const {
    slug,
    type,
  }: {
    slug: string;
    type: ProfileSocialListType;
  } = $props();

  const { profiles, isLoading } = $derived(useFollowing(slug, type));

  const placeholder = $derived(getProfileSocialPlaceholder(type));
</script>

<GridList
  id={`profiles-paginated-list-${slug}-${type}`}
  items={$profiles}
  sizing="auto"
  --width-item="var(--ni-148)"
>
  {#snippet item(profile)}
    <ProfileCard {profile} />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      {placeholder}
    {:else}
      <LoadingIndicator />
    {/if}
  {/snippet}
</GridList>
