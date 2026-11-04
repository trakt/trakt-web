<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  const { user } = useUser();

  const initial = $derived(
    ($user.name.first || $user.username).charAt(0).toUpperCase(),
  );
</script>

<span class="trakt-match-avatar">
  {#if $user.avatar.url}
    <CrossOriginImage
      src={$user.avatar.url}
      alt={m.image_alt_user_avatar({ username: $user.username })}
    />
  {:else}
    <span class="trakt-match-avatar-initial" aria-hidden="true">{initial}</span>
  {/if}
</span>

<style>
  .trakt-match-avatar {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    box-sizing: border-box;
    border: var(--ni-2) solid var(--color-background);
    border-radius: 50%;
    overflow: hidden;

    background: var(--color-background-default-hover);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .trakt-match-avatar-initial {
    font-size: var(--ni-10);
    font-weight: 700;
    line-height: 1;
    color: var(--color-text-primary);
  }
</style>
