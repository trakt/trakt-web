<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import RemoveIcon from "$lib/components/icons/RemoveIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { toUserSlug } from "$lib/utils/profile/toUserSlug";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { CollaboratorCandidate } from "./useManageCollaborators";

  const {
    candidate,
    isPending,
    onToggle,
  }: {
    candidate: CollaboratorCandidate;
    isPending: boolean;
    onToggle: () => void;
  } = $props();

  const { profile, isCollaborator } = $derived(candidate);
  const slug = $derived(toUserSlug(profile));
  const displayName = $derived(toDisplayableName(profile));

  const { color, variant: _variant, ...dangerEvents } = $derived(
    useDangerButton({ isActive: isCollaborator, color: "default" }),
  );
</script>

<div class="trakt-collaborator-row">
  <Link href={UrlBuilder.profile.user(slug)} color="inherit">
    <div class="collaborator-identity">
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
  <ActionButton
    style="ghost"
    color={$color as "default" | "red"}
    label={isCollaborator
      ? m.button_label_remove_collaborator({ username: displayName })
      : m.button_label_add_collaborator({ username: displayName })}
    disabled={isPending}
    onclick={onToggle}
    {...dangerEvents}
  >
    {#if isCollaborator}
      <RemoveIcon />
    {:else}
      <AddIcon />
    {/if}
  </ActionButton>
</div>

<style lang="scss">
  .trakt-collaborator-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    padding: var(--gap-s) var(--gap-m);

    :global(.trakt-link) {
      text-decoration: none;
      min-width: 0;
      flex: 1;
    }
  }

  .collaborator-identity {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;

    p {
      min-width: 0;
    }
  }
</style>
