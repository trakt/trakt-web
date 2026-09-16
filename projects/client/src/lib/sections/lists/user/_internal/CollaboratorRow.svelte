<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CheckboxIcon from "$lib/components/icons/CheckboxIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
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
  const displayName = $derived(toDisplayableName(profile));

  const { color, variant: _variant, ...dangerEvents } = $derived(
    useDangerButton({ isActive: isCollaborator, color: "default" }),
  );

  const itemProps: Omit<ButtonProps, "children"> = $derived({
    style: "flat",
    label: isCollaborator
      ? m.button_label_remove_collaborator({ username: displayName })
      : m.button_label_add_collaborator({ username: displayName }),
    "aria-pressed": isCollaborator ? "true" : "false",
    color: $color,
    variant: "primary",
    disabled: isPending,
    onclick: onToggle,
    ...dangerEvents,
  });
</script>

{#snippet username()}
  @{profile.username}
{/snippet}

<DropdownItem
  {...itemProps}
  subtitle={profile.name.full ? username : undefined}
>
  {displayName}

  {#snippet icon()}
    <ProfileImage
      --image-size="var(--ni-32)"
      --border-width="var(--border-thickness-xs)"
      name={profile.name.first}
      src={profile.avatar.url}
      isVip={profile.isVip}
    />
  {/snippet}

  {#snippet end()}
    {#if isPending}
      <LoadingIndicator />
    {:else}
      <CheckboxIcon state={isCollaborator ? "checked" : "unchecked"} />
    {/if}
  {/snippet}
</DropdownItem>
