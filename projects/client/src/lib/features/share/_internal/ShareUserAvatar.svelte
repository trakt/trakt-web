<svelte:options css="injected" />

<script lang="ts">
  import type { ShareUser } from "../models/ShareUser.ts";
  import ShareVipBadge from "./ShareVipBadge.svelte";

  const { user }: { user: ShareUser } = $props();
</script>

<div class="trakt-share-user-avatar">
  {#if user.avatarUrl}
    <img
      class="share-user-avatar-image"
      class:is-vip={user.isVip}
      src={user.avatarUrl}
      alt=""
    />
  {/if}
  {#if user.isVip || user.isDirector}
    <div
      class="share-user-avatar-vip"
      class:has-avatar={Boolean(user.avatarUrl)}
    >
      <ShareVipBadge {user} size="small" />
    </div>
  {/if}
</div>

<style>
  .trakt-share-user-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .share-user-avatar-vip {
    position: relative;

    display: flex;
  }

  .share-user-avatar-vip.has-avatar {
    margin-top: -18px;
  }

  .share-user-avatar-image {
    width: 88px;
    height: 88px;

    border-radius: 50%;
    object-fit: cover;
  }

  .share-user-avatar-image.is-vip {
    box-sizing: border-box;

    border: 4px solid #8a70f5;
    box-shadow:
      0 0 12px rgba(138, 112, 245, 0.6),
      0 0 24px rgba(118, 84, 226, 0.5);
  }
</style>
