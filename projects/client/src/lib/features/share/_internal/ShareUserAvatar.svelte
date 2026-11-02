<svelte:options css="injected" />

<script lang="ts">
  import type { ShareUser } from "../models/ShareUser.ts";
  import ShareVipBadge from "./ShareVipBadge.svelte";

  const {
    user,
    size = "normal",
  }: { user: ShareUser; size?: "normal" | "large" } = $props();

  const initial = $derived(
    user.name.replace(/^@/, "").at(0)?.toUpperCase() ?? "",
  );
</script>

<div class="trakt-share-user-avatar" data-size={size}>
  {#if user.avatarUrl}
    <img
      class="share-user-avatar-image"
      class:is-vip={user.isVip}
      src={user.avatarUrl}
      alt=""
    />
  {:else}
    <div class="share-user-avatar-image" class:is-vip={user.isVip}>
      {initial}
    </div>
  {/if}
  {#if user.badgeLabel}
    <div class="share-user-avatar-vip">
      <ShareVipBadge
        label={user.badgeLabel}
        size={size === "large" ? "normal" : "small"}
      />
    </div>
  {/if}
</div>

<style>
  .trakt-share-user-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;

    color: #efefef;
  }

  .share-user-avatar-vip {
    position: relative;

    display: flex;
    margin-top: -18px;
  }

  .share-user-avatar-image {
    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    width: 88px;
    height: 88px;

    font-size: 38px;
    font-weight: bold;

    background: #1b2b36;
    border-radius: 50%;
    object-fit: cover;
  }

  .share-user-avatar-image.is-vip {
    border: 4px solid #8a70f5;
    box-shadow:
      0 0 12px rgba(138, 112, 245, 0.6),
      0 0 24px rgba(118, 84, 226, 0.5);
  }

  .trakt-share-user-avatar[data-size="large"] .share-user-avatar-image {
    width: 240px;
    height: 240px;

    font-size: 104px;

    border: 6px solid #efefef;
  }

  .trakt-share-user-avatar[data-size="large"] .share-user-avatar-image.is-vip {
    border-color: #8a70f5;
    box-shadow:
      0 0 24px rgba(138, 112, 245, 0.6),
      0 0 48px rgba(118, 84, 226, 0.5);
  }

  .trakt-share-user-avatar[data-size="large"] .share-user-avatar-vip {
    margin-top: -32px;
  }
</style>
