<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import { useSettings } from "./useSettings";

  const { user } = useUser();
  const { profile } = useSettings();
</script>

<SettingsGroupCard variant={$user.isVip ? "vip" : "muted"}>
  <div class="trakt-settings-profile-card">
    <ProfileImage
      isEditable
      --image-size="var(--ni-56)"
      --border-width="var(--border-thickness-xs)"
      name={$user.name.first}
      src={$user.avatar.url}
      isVip={$user.isVip}
    />

    <div class="trakt-settings-profile-info">
      <span class="bold ellipsis title">
        {$profile.displayName || $profile.username}
      </span>
      {#if $profile.location}
        <p class="secondary small">{$profile.location}</p>
      {/if}
    </div>

    {#if $user.isVip}
      <Link
        href={UrlBuilder.vip()}
        color="inherit"
        label={m.button_label_manage_subscription()}
      >
        <VipBadge isDirector={$user.isDirector} />
      </Link>
    {:else}
      <GetVIPLink source="profile-settings" />
    {/if}
  </div>
</SettingsGroupCard>

<style lang="scss">
  .trakt-settings-profile-card {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--gap-m);

    :global(.trakt-link) {
      display: inline-flex;
      text-decoration: none;
    }
  }

  .trakt-settings-profile-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
