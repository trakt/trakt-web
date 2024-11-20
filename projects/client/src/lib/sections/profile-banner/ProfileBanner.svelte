<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { currentUser, type User } from "$lib/requests/users/currentUser";

  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

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
    cover: {
      url: "",
    },
    isVip: false,
  };

  const user = writable(emptyUser);

  onMount(() => {
    currentUser().then(user.set);
  });
</script>

{#if $user.cover.url}
  <BackgroundCoverImage src={$user.cover.url} type="Main" />
{/if}

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
    margin-left: calc(3.25rem + var(--layout-distance-side));
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: var(--transition-increment) ease-in-out;
    transition-property: margin-left;

    @media (max-width: 480px) {
      margin-left: 2rem;
    }
  }

  .profile-image {
    margin: 0;

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
    gap: 0.25rem;

    .profile-info-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .profile-info-location {
      color: var(--color-text-secondary);
    }
  }
</style>
