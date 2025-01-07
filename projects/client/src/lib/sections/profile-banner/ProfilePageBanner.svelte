<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useUser } from "../../features/auth/stores/useUser";
  import ProfileImage from "./ProfileImage.svelte";

  const { current } = useUser();
</script>

{#if current() != null}
  <div class="profile-page-banner-container">
    <div class="profile-image-container" class:user-is-vip={current().isVip}>
      <ProfileImage
        --width="var(--ni-64)"
        --height="var(--ni-64)"
        --border-width="var(--border-thickness-s)"
      />
      {#if current().isVip}
        <VipBadge />
      {/if}
    </div>
    <RenderFor audience="authenticated" device={["desktop"]}>
      <div class="profile-info">
        <h5>
          {m.profile_banner_greeting({ name: current().name.first })}
        </h5>
        <h6 class="user-location">{current().location}</h6>
      </div>
    </RenderFor>
  </div>
{/if}

<style>
  .profile-page-banner-container {
    margin-left: var(--ni-72);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-16);
  }

  .profile-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    :global(.trakt-vip-badge) {
      z-index: 2;
      margin-top: var(--ni-neg-16);
    }

    &.user-is-vip {
      --color-border-avatar: var(--color-border-vip-avatar);
    }
  }

  .profile-info {
    .user-location {
      color: var(--color-text-secondary);
    }
  }
</style>
