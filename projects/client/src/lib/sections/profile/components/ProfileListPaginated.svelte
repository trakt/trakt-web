<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFollowing } from "../stores/useFollowing";
  import ProfileCard from "./ProfileCard.svelte";

  const {
    slug,
    type,
  }: {
    slug: string;
    type: "following" | "followers";
  } = $props();

  const { profiles, isLoading } = $derived(useFollowing(slug, type));

  const placeholder = $derived(
    type === "following"
      ? m.list_placeholder_following()
      : m.list_placeholder_followers(),
  );
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
