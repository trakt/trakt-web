<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import ProfileCard from "./ProfileCard.svelte";

  type ListType = "following" | "followers";

  const {
    profiles,
    type,
    slug,
  }: { profiles: UserProfile[]; type: ListType; slug: string } = $props();

  const sluggedProfiles = $derived(
    profiles.map((profile) => ({
      ...profile,
      id: profile.slug,
    })),
  );

  const title = $derived(
    type === "following" ? m.list_title_following() : m.list_title_followers(),
  );

  const placeholder = $derived(
    type === "following"
      ? m.list_placeholder_following()
      : m.list_placeholder_followers(),
  );
</script>

<SectionList
  id={`profiles-list-${slug}-${type}`}
  items={sluggedProfiles}
  {title}
  --height-list="var(--height-landscape-list)"
>
  {#snippet empty()}
    {placeholder}
  {/snippet}

  {#snippet item(profile)}
    <ProfileCard {profile} />
  {/snippet}
</SectionList>
