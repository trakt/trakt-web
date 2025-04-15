<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ProfileImage from "../profile-banner/ProfileImage.svelte";
  import VipBadge from "./components/VIPBadge.svelte";

  const { user } = useUser();
  const isVip = $derived(!!$user?.isVip);
  const color = $derived(isVip ? "red" : "purple");
  const style = $derived(isVip ? "textured" : "flat");
</script>

<Button
  size="small"
  href={UrlBuilder.profile.me()}
  label={m.user_profile_label()}
  {color}
  {style}
  navigationType={DpadNavigationType.Item}
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
        name={$user?.name?.first ?? ""}
        src={$user?.avatar?.url ?? ""}
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
</Button>

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
