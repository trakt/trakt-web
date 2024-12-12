<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ProfileImage from "../profile-banner/ProfileImage.svelte";
  import VipBadge from "./components/VIPBadge.svelte";

  const user = useUser();
  const variant = $derived(user.current().isVip ? "vip" : "primary");
  const actionVariant = $derived(user.current().isVip ? "red" : "purple");
  const style = $derived(user.current().isVip ? "textured" : "flat");
</script>

{#if !user.current().isVip}
  <RenderFor audience="authenticated" device={["desktop", "tablet-lg"]}>
    <Button
      href={UrlBuilder.vip()}
      label={m.get_vip_label()}
      variant="vip"
      style="textured"
    >
      {m.get_vip()}
      {#snippet icon()}
        <VipIcon />
      {/snippet}
    </Button>
  </RenderFor>

  <RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
    <ActionButton
      href={UrlBuilder.vip()}
      label={m.get_vip_label()}
      variant="red"
    >
      <VipIcon />
    </ActionButton>
  </RenderFor>
{/if}

<RenderFor audience="authenticated" device={["desktop", "tablet-lg"]}>
  <Button
    href={UrlBuilder.profile.me()}
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
</RenderFor>

<RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
  <ActionButton
    href={UrlBuilder.profile.me()}
    label={m.user_profile_label()}
    variant={actionVariant}
  >
    <ProfileImage
      --width="var(--ni-24)"
      --height="var(--ni-24)"
      --border-width="var(--ni-2)"
    />
  </ActionButton>
</RenderFor>

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
