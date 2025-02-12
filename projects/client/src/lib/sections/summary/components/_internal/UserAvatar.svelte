<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Snippet } from "svelte";

  type UserAvatarProps = {
    src: string;
    name: string;
    size?: "small" | "large";
    icon?: Snippet;
  };

  const { src, name, size = "large", icon }: UserAvatarProps = $props();
</script>

<div class="trakt-user-avatar" data-size={size}>
  <CrossOriginImage {src} alt={m.users_avatar({ username: name })} />

  {#if icon}
    {@render icon()}
  {/if}
</div>

<style>
  .trakt-user-avatar {
    position: relative;

    width: var(--ni-44);
    height: var(--ni-44);
    flex-shrink: 0;

    &[data-size="small"] {
      width: var(--ni-32);
      height: var(--ni-32);
    }

    :global(img) {
      border-radius: 50%;
      box-sizing: border-box;

      width: 100%;
      height: 100%;
    }
  }
</style>
