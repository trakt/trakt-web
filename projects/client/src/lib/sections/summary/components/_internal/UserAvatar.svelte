<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  type UserAvatarProps = {
    src: string;
    name: string;
  };

  const { src, name }: UserAvatarProps = $props();
</script>

<div class="trakt-user-avatar">
  <CrossOriginImage {src} alt={m.users_avatar({ userName: name })} />
</div>

<style>
  .trakt-user-avatar {
    width: var(--ni-36);
    height: var(--ni-36);
    flex-shrink: 0;

    :global(img) {
      border-radius: 50%;
      box-sizing: border-box;

      width: 100%;
      height: 100%;
    }
  }
</style>
