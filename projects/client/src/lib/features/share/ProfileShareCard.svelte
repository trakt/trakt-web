<svelte:options css="injected" />

<script lang="ts">
  import ShareUserAvatar from "./_internal/ShareUserAvatar.svelte";
  import type { ProfileShareData } from "./models/ProfileShareData.ts";
  import ShareCardFrame from "./ShareCardFrame.svelte";

  const { data }: { data: ProfileShareData } = $props();

  const chips = $derived(
    [
      { key: "location", label: data.location },
      {
        key: "joined",
        label: data.joinedYear ? `Joined ${data.joinedYear}` : null,
      },
    ].filter((chip): chip is { key: string; label: string } =>
      Boolean(chip.label),
    ),
  );
</script>

{#snippet backdrop()}
  {#if data.coverUrl}
    <img class="profile-share-cover" src={data.coverUrl} alt="" />
    <div class="profile-share-cover-shade"></div>
  {:else}
    <div class="profile-share-glow" class:is-vip={data.user.isVip}></div>
  {/if}
{/snippet}

<ShareCardFrame variant="open-graph" {backdrop} hasWatermark={!data.coverUrl}>
  <div class="trakt-profile-share-card">
    <ShareUserAvatar user={data.user} size="large" />
    <div class="profile-share-details">
      <h1 class="profile-share-name">{data.user.name}</h1>
      {#if data.user.username}
        <span class="profile-share-username">@{data.user.username}</span>
      {/if}
      {#if chips.length > 0}
        <div class="profile-share-chips">
          {#each chips as chip (chip.key)}
            <span class="profile-share-chip">{chip.label}</span>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</ShareCardFrame>

<style>
  .profile-share-cover,
  .profile-share-cover-shade,
  .profile-share-glow {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }

  .profile-share-cover {
    object-fit: cover;
  }

  .profile-share-cover-shade {
    background: linear-gradient(
      90deg,
      rgba(9, 11, 18, 0.94) 0%,
      rgba(9, 11, 18, 0.78) 50%,
      rgba(9, 11, 18, 0.4) 100%
    );
  }

  .profile-share-glow {
    background: radial-gradient(
      circle at 24% 50%,
      rgba(0, 136, 204, 0.45) 0%,
      rgba(0, 136, 204, 0) 45%
    );
  }

  .profile-share-glow.is-vip {
    background: radial-gradient(
      circle at 24% 50%,
      rgba(138, 112, 245, 0.55) 0%,
      rgba(138, 112, 245, 0) 45%
    );
  }

  .trakt-profile-share-card {
    position: relative;

    display: flex;
    align-items: center;
    gap: 56px;

    width: 100%;
    padding-left: 30px;

    color: #efefef;
  }

  .profile-share-details {
    display: flex;
    flex-direction: column;

    min-width: 0;
  }

  .profile-share-name {
    margin: 0;

    font-size: 76px;
    line-height: 84px;
    font-weight: bold;
    letter-spacing: -1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .profile-share-username {
    margin-top: 4px;

    font-size: 34px;
    color: rgba(239, 239, 239, 0.7);
  }

  .profile-share-chips {
    display: flex;
    gap: 14px;

    margin-top: 32px;
  }

  .profile-share-chip {
    display: flex;

    padding: 10px 24px;

    font-size: 26px;
    white-space: nowrap;

    background: rgba(255, 255, 255, 0.12);
    border-radius: 40px;
  }
</style>
