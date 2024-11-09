<script lang="ts">
  import { currentUser, type User } from "$lib/requests/users/currentUser";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import VipBadge from "$lib/components/badge/VipBadge.svelte";

  const emptyUser: User = {
    name: {
      first: "---------",
      last: "---------",
      full: "--------- ---------",
    },
    location: "------, ------",
    avatar: {
      url: "",
    },
    isVip: false,
    isVipEp: false,
  };

  const user = writable(emptyUser);

  onMount(() => {
    currentUser().then(user.set);
  });
</script>

<div class="profile-banner-container">
  <div class="profile-image">
    <CrossOriginImage
      src={$user.avatar.url}
      alt={`${$user.name.first}'s avatar'`}
    />
  </div>
  <div class="profile-info">
    <div class="profile-info-primary">
      <p class="profile-info-greeting">
        {m.profile_banner_greeting({ name: $user.name.first })}
      </p>
      {#if $user.isVip}
        <VipBadge />
      {/if}
    </div>
    <p class="profile-info-location">{$user.location}</p>
  </div>
</div>

<style>
  .profile-banner-container {
    margin: 1rem 3.25rem;

    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile-image {
    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    overflow: hidden;

    border: 0.25rem solid var(--color-border-avatar);
  }

  .profile-info {
    display: inline-flex;
    flex-direction: column;
    gap: 0.5rem;

    .profile-info-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .profile-info-greeting {
      margin: 0;

      font-size: 1.5rem;
      font-style: normal;
      font-weight: 600;
      line-height: 90%;
    }

    .profile-info-location {
      margin: 0;

      color: #bcbcbc;
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 600;
      line-height: 90%;
      text-transform: uppercase;
    }
  }
</style>
