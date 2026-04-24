<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import { useBlockUser } from "$lib/sections/profile-banner/_internal/useBlockUser";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { profile }: { profile: UserProfile } = $props();

  const slug = $derived(profile.slug ?? profile.username);
  const displayName = $derived(toDisplayableName(profile));

  const blockActions = useBlockUser();
  const { isRequestingBlock } = blockActions;
</script>

<div class="trakt-blocked-user-row">
  <Link
    href={UrlBuilder.profile.user(slug)}
    color="inherit"
  >
    <div class="blocked-user-identity">
      <ProfileImage
        --image-size="var(--ni-40)"
        --border-width="var(--border-thickness-xs)"
        name={profile.name.first}
        src={profile.avatar.url}
        isVip={profile.isVip}
      />
      <p class="ellipsis">{displayName}</p>
    </div>
  </Link>
  <Button
    size="small"
    color="default"
    variant="secondary"
    label={m.button_label_unblock({ username: displayName })}
    disabled={$isRequestingBlock}
    onclick={() => blockActions.unblockUser(slug)}
  >
    {m.button_text_unblock()}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-blocked-user-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    padding: var(--ni-12) 0;

    :global(.trakt-link) {
      text-decoration: none;
      min-width: 0;
      flex: 1;
    }
  }

  .blocked-user-identity {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;

    p {
      min-width: 0;
    }
  }
</style>
