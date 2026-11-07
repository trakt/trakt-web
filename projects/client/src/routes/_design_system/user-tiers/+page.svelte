<script lang="ts">
  import AvatarStack from "$lib/components/avatar-stack/AvatarStack.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import UserTierBadge from "$lib/features/vip-veteran/UserTierBadge.svelte";
  import type { TieredUser } from "$lib/features/vip-veteran/TieredUser.ts";
  import type { VipVeteran } from "$lib/requests/models/VipVeteran.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import VipStreakBadge from "$lib/sections/profile/vip-streak/VipStreakBadge.svelte";
  import VipStreakDrawer from "$lib/sections/profile/vip-streak/VipStreakDrawer.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const avatar = {
    url: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#9a9a9a"/><circle cx="32" cy="25" r="11" fill="#d9d9d9"/><path d="M12 64c0-14 9-23 20-23s20 9 20 23z" fill="#d9d9d9"/></svg>`,
    )}`,
  };

  const streak = (
    years: number,
    title: VipVeteran["title"] = null,
  ): VipVeteran => ({
    since: new Date(Date.now() - years * 366 * 24 * 60 * 60 * 1000),
    years,
    title,
    graceEndsAt: null,
  });

  const members: ReadonlyArray<{ name: string; member: TieredUser }> = [
    { name: "Free", member: { isVip: false } },
    { name: "VIP", member: { isVip: true, veteran: streak(1) } },
    {
      name: "VIP Pro, 3 years",
      member: { isVip: true, veteran: streak(3, "pro") },
    },
    {
      name: "Veteran, 5 years",
      member: { isVip: true, veteran: streak(5, "veteran") },
    },
    {
      name: "Elite, 7 years",
      member: { isVip: true, veteran: streak(7, "elite") },
    },
    {
      name: "Legend, 10 years",
      member: { isVip: true, veteran: streak(10, "legend") },
    },
    {
      name: "Director, 7 years",
      member: {
        isVip: true,
        isDirector: true,
        veteran: streak(7, "elite"),
      },
    },
  ];

  const columns = [
    "Tier",
    "Stack",
    "Mobile navbar",
    "Small",
    "Navbar, active",
    "Large",
    "Profile header",
    "Podium",
  ];

  let previewed = $state<VipVeteran | null>(null);

  const preview = (veteran: VipVeteran) => (event: MouseEvent) => {
    event.preventDefault();
    previewed = veteran;
  };

  const toUser = (name: string, member: TieredUser) => ({
    ...member,
    slug: "sample",
    username: name,
    avatar,
  });

  const toStack = (name: string, member: TieredUser) =>
    ["a", "b", "c"].map((key) => ({ key, user: toUser(name, member) }));
</script>

{#snippet headerBadge(member: TieredUser)}
  {#if member.veteran}
    <span onclickcapture={preview(member.veteran)}>
      <VipStreakBadge veteran={member.veteran} isDirector={member.isDirector} />
    </span>
  {:else}
    <UserTierBadge {member} />
  {/if}
{/snippet}

<main class="user-tiers-page">
  <section class="layout-section">
    <h2>User tiers</h2>

    <div class="user-tiers-grid">
      {#each columns as column (column)}
        <span class="tag secondary uppercase">{column}</span>
      {/each}

      {#each members as { name, member } (name)}
        {@const user = toUser(name, member)}
        <div class="user-tiers-row">
          <span class="bold">{name}</span>
          <AvatarStack avatars={toStack(name, member)} />
          <ProfileImage
            --image-size="var(--ni-24)"
            {name}
            src={avatar.url}
            {member}
          />
          <UserAvatar {user} size="small" />
          <ProfileImage
            --image-size="var(--ni-32)"
            {name}
            src={avatar.url}
            {member}
            isHighlighted
          />
          <UserAvatar {user} />
          <span class="header-cell">
            <ProfileImage
              --image-size="var(--ni-64)"
              {name}
              src={avatar.url}
              {member}
              ringMotion="live"
            >
              {#snippet badge()}
                {@render headerBadge(member)}
              {/snippet}
            </ProfileImage>
          </span>
          <Link href={UrlBuilder.profile.user("sample")} color="inherit">
            <ProfileImage
              --image-size="var(--ni-88)"
              {name}
              src={avatar.url}
              {member}
              ringMotion="live"
            />
          </Link>
        </div>
      {/each}
    </div>
  </section>
</main>

{#if previewed}
  <VipStreakDrawer veteran={previewed} onClose={() => (previewed = null)} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .user-tiers-page,
  .layout-section {
    display: flex;
    flex-direction: column;
  }

  .user-tiers-page {
    gap: var(--gap-xxl);
    min-width: 0;
    padding-block: var(--ni-32);

    @include for-tablet-sm-and-below {
      padding-block: var(--ni-20);
    }
  }

  .layout-section {
    gap: var(--gap-l);
    min-width: 0;

    h2 {
      margin: 0;
    }
  }

  .user-tiers-grid {
    display: grid;
    grid-template-columns: repeat(8, max-content);
    align-items: center;
    justify-items: center;
    gap: var(--gap-m) var(--gap-xl);
    overflow-x: auto;

    > :first-child {
      justify-self: start;
    }

    > .tag {
      inline-size: min-content;
      text-align: center;
    }
  }

  .header-cell {
    display: block;
    block-size: var(--ni-64);
  }

  .user-tiers-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: center;
    justify-items: center;

    > :first-child {
      justify-self: start;
    }
  }
</style>
