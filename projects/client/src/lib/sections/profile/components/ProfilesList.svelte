<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import * as m from "$lib/features/i18n/messages.ts";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import { useFollowing } from "../stores/useFollowing";
  import ProfileItem from "./ProfileItem.svelte";

  const {
    slug,
  }: {
    slug: string;
  } = $props();

  const { current, set, options } = useToggler("social");
  const { profiles, isLoading } = $derived(useFollowing(slug, $current.value));

  const placeholder = $derived(
    $current.value === "following"
      ? m.list_placeholder_following()
      : m.list_placeholder_followers(),
  );

  const { isMe } = $derived(useIsMe(slug));
</script>

<div class="trakt-profiles-list">
  <SectionList
    id={`profiles-list-${slug}-${$current.value}`}
    items={$profiles}
    title={m.list_title_social()}
    --height-list="var(--height-profile-list)"
    metaInfo={$current.text()}
  >
    {#snippet empty()}
      {#if !$isLoading}
        {#if $isMe && $current.value === "following"}
          <CtaItem cta={{ type: "social" }} variant="placeholder" />
        {:else}
          {placeholder}
        {/if}
      {/if}
    {/snippet}

    {#snippet item(profile)}
      <ProfileItem {profile} />
    {/snippet}

    {#snippet badge()}
      <Toggler value={$current.value} onChange={set} {options} />
    {/snippet}
  </SectionList>
</div>

<style>
  .trakt-profiles-list {
    :global(.trakt-list-item-container) {
      gap: var(--ni-0);
    }

    :global(.trakt-cta-list-card) {
      --height-override-card: var(--height-list);
      --height-override-card-cover: var(--height-list);
    }
  }
</style>
