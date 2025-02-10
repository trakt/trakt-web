<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ProfileImage from "../profile-banner/ProfileImage.svelte";
  import VipBadge from "./components/VIPBadge.svelte";

  const { user } = useUser();
  const { logout } = useAuth();
  const isVip = $derived(!!$user?.isVip);
  const color = $derived(isVip ? "red" : "purple");
  const style = $derived(isVip ? "textured" : "flat");
</script>

{#if !isVip}
  <RenderFor audience="authenticated" device={["desktop"]}>
    <Button
      href={UrlBuilder.vip()}
      label={m.get_vip_label()}
      color="red"
      style="textured"
      size="small"
    >
      {m.get_vip()}
      {#snippet icon()}
        <VipIcon />
      {/snippet}
    </Button>
  </RenderFor>

  <RenderFor
    audience="authenticated"
    device={["mobile", "tablet-sm", "tablet-lg"]}
  >
    <ActionButton href={UrlBuilder.vip()} label={m.get_vip_label()} color="red">
      <VipIcon />
    </ActionButton>
  </RenderFor>
{/if}

<DropdownList
  label={m.user_menu_toggle_label()}
  variant="primary"
  {style}
  {color}
  text="capitalize"
  size="small"
>
  <RenderFor audience="authenticated" device={["desktop"]}>
    {$user?.name?.first}
  </RenderFor>
  {#snippet icon()}
    <div class="profile-icon">
      <ProfileImage
        --width="var(--ni-16)"
        --height="var(--ni-16)"
        --border-width="var(--border-thickness-xs)"
      />
      <RenderFor
        audience="authenticated"
        device={["tablet-sm", "tablet-lg", "desktop"]}
      >
        {#if isVip}
          <VipBadge />
        {/if}
      </RenderFor>
    </div>
  {/snippet}
  {#snippet items()}
    <DropdownItem href={UrlBuilder.profile.me()}>
      {m.profile()}
    </DropdownItem>
    <DropdownItem color="red" onclick={logout}>
      {m.logout()}
    </DropdownItem>
  {/snippet}
</DropdownList>

<style>
  :global(.trakt-navbar .trakt-profile-button) {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
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
      z-index: var(--layer-raised);
    }
  }
</style>
