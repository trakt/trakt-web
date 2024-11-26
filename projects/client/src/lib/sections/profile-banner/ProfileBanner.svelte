<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useUser } from "../../features/auth/stores/useUser";

  const { user } = useUser();
</script>

{#if $user != null}
  <BackgroundCoverImage src={$user.cover.url} type="Main" />

  <div class="profile-banner-container">
    <figure class="profile-image">
      <CrossOriginImage
        src={$user.avatar.url}
        alt={`${$user.name.first}'s avatar`}
      />
      <figcaption class="visually-hidden">
        {m.profile_banner_greeting({ name: $user.name.first })}
      </figcaption>
    </figure>
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
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

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

  .profile-image {
    margin: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    width: var(--ni-64);
    height: var(--ni-64);
    border-radius: 50%;
    overflow: hidden;

    border: var(--ni-4) solid var(--color-border-avatar);
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
