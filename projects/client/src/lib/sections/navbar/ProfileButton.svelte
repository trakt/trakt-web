<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages";
  import ProfileImage from "../profile-banner/ProfileImage.svelte";
  import VipBadge from "./components/VIPBadge.svelte";

  const user = useUser();
  const variant = $derived(user.current().isVip ? "vip" : "primary");
  const style = $derived(user.current().isVip ? "textured" : "flat");
</script>

{#if !user.current().isVip}
  <Link href="https://trakt.tv/vip">
    <Button label={m.get_vip_label()} variant="vip" style="textured">
      {m.get_vip()}
      {#snippet icon()}
        <VipIcon />
      {/snippet}
    </Button>
  </Link>
{/if}

<Button
  label={m.user_profile_label()}
  {variant}
  {style}
  text="capitalize"
  size="small"
>
  {user.current().name.first}
  {#snippet icon()}
    <div class="profile-icon">
      <ProfileImage
        --width="var(--ni-24)"
        --height="var(--ni-24)"
        --border-width="var(--ni-2)"
      />
      {#if user.current().isVip}
        <VipBadge />
      {/if}
    </div>
  {/snippet}
</Button>

<style>
  :global(.trakt-navbar .trakt-profile-button) {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  :global(.trakt-navbar .trakt-profile-button .profile-image) {
    width: var(--ni-32);
    height: var(--ni-32);
  }

  .profile-icon {
    display: flex;
    align-items: center;

    :global(.vip-badge) {
      margin-left: var(--ni-neg-8);
      z-index: 1;
    }
  }
</style>
