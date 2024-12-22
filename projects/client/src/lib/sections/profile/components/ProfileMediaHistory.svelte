<script lang="ts">
  import ProfileTotalRuntime from "./ProfileTotalRuntime.svelte";

  type ProfileMediaHistoryProps = {
    items: { runtime: number }[];
    title: string;
    footer: string;
  };

  const { items, title, footer }: ProfileMediaHistoryProps = $props();
</script>

<div class="trakt-profile-media-history">
  <p class="meta-info secondary">{title}</p>
  <div class="trakt-profile-media-history-details">
    <ProfileTotalRuntime {items} />
    <p class="meta-info secondary">
      {footer}
    </p>
  </div>
</div>

<style>
  .trakt-profile-media-history {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
  }
</style>
