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

  const title = $derived(type === "following" ? m.following() : m.followers());
</script>

<SectionList
  id={`profiles-list-${slug}-${type}`}
  items={sluggedProfiles}
  {title}
  --height-list="var(--height-landscape-list)"
>
  {#snippet empty()}
    {m.not_following_anyone()}
  {/snippet}

  {#snippet item(profile)}
    <ProfileCard {profile} />
  {/snippet}
</SectionList>
