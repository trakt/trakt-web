<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useUser } from "../../features/auth/stores/useUser";
  import ProfileImage from "./ProfileImage.svelte";

  const { user } = useUser();
</script>

{#if $user != null}
  <div class="profile-banner-container">
    <Link href="/profile/me">
      <ProfileImage
        --width="var(--ni-64)"
        --height="var(--ni-64)"
        --border-width="var(--ni-4)"
      />
    </Link>
    <div class="profile-info">
      <div class="profile-info-primary">
        <h5 class="profile-info-greeting ellipsis">
          {m.profile_banner_greeting({ name: $user.name.first })}
        </h5>
        {#if $user.isVip}
          <VipBadge />
        {/if}
      </div>
      <h6 class="profile-info-location ellipsis">{$user.location}</h6>
    </div>
  </div>
{/if}

<style>
  .profile-banner-container {
    margin-left: calc(var(--ni-52) + var(--layout-distance-side));
    display: flex;
    align-items: center;
    gap: var(--ni-16);
    transition: var(--transition-increment) ease-in-out;
    transition-property: margin-left;

    @media (max-width: 480px) {
      margin-left: var(--ni-32);
    }
  }

  .profile-info {
    display: inline-flex;
    flex-direction: column;
    gap: var(--ni-4);

    .profile-info-primary {
      display: flex;
      align-items: center;
      gap: var(--ni-8);
    }

    .profile-info-location {
      color: var(--color-text-secondary);
    }
  }
</style>
