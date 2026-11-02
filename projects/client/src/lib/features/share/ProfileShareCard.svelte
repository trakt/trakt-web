<svelte:options css="injected" />

<script lang="ts">
  import ShareUserAvatar from "./_internal/ShareUserAvatar.svelte";
  import type { ProfileShareData } from "./models/ProfileShareData.ts";
  import ShareCardFrame from "./ShareCardFrame.svelte";

  const { data }: { data: ProfileShareData } = $props();

  const subtitle = $derived(
    [
      data.user.username && `@${data.user.username}`,
      data.joinedYear && `Joined ${data.joinedYear}`,
    ]
      .filter(Boolean)
      .join(" · "),
  );
</script>

<ShareCardFrame variant="open-graph">
  <div class="trakt-profile-share-card">
    <ShareUserAvatar user={data.user} size="large" />
    <div class="profile-share-details">
      <h1 class="profile-share-name">{data.user.name}</h1>
      {#if subtitle}
        <span class="profile-share-subtitle">{subtitle}</span>
      {/if}
    </div>
  </div>
</ShareCardFrame>

<style>
  .trakt-profile-share-card {
    position: relative;

    display: flex;
    align-items: center;
    gap: 48px;

    width: 100%;

    color: #efefef;
  }

  .profile-share-details {
    display: flex;
    flex-direction: column;
    gap: 6px;

    min-width: 0;
  }

  .profile-share-name {
    margin: 0;

    font-size: 72px;
    line-height: 80px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .profile-share-subtitle {
    font-size: 30px;
    color: rgba(239, 239, 239, 0.7);
  }
</style>
