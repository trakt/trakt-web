<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFollowing } from "../stores/useFollowing";
  import ProfileItem from "./ProfileItem.svelte";

  const {
    slug,
  }: {
    slug: string;
  } = $props();

  const { current, set, options } = useToggler("social");
  const { profiles, isLoading } = $derived(useFollowing(slug, $current));

  const placeholder = $derived(
    $current === "following"
      ? m.list_placeholder_following()
      : m.list_placeholder_followers(),
  );
</script>

<div class="trakt-profiles-list">
  <SectionList
    id={`profiles-list-${slug}-${$current}`}
    items={$profiles}
    title={m.list_title_social()}
    --height-list="var(--height-profile-list)"
  >
    {#snippet empty()}
      {#if !$isLoading}
        {placeholder}
      {/if}
    {/snippet}

    {#snippet item(profile)}
      <ProfileItem {profile} />
    {/snippet}

    {#snippet badge()}
      <Toggler value={$current} onChange={set} {options} />
    {/snippet}
  </SectionList>
</div>

<style>
  .trakt-profiles-list {
    :global(.trakt-list-item-container) {
      gap: var(--ni-0);
    }
  }
</style>
