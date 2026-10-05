<script lang="ts">
  import CastIcon from "$lib/components/icons/CastIcon.svelte";
  import CrewIcon from "$lib/components/icons/CrewIcon.svelte";
  import GroupIcon from "$lib/components/icons/GroupIcon.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import type { CreditsType } from "$lib/sections/summary/models/CreditsType.ts";
  import type { Snippet } from "svelte";
  import type { CreditsTogglerProps } from "./CreditsTogglerProps.ts";

  const { groups, value, onChange }: CreditsTogglerProps = $props();

  const icons: Record<CreditsType, Snippet> = {
    main: mainIcon,
    supporting: supportingIcon,
    crew: crewIcon,
  };

  const options = $derived<ToggleOption<CreditsType>[]>(
    groups.map((group) => ({
      value: group.type,
      text: () => group.label,
      label: () => group.label,
      icon: icons[group.type],
    })),
  );
</script>

{#snippet mainIcon()}
  <CastIcon />
{/snippet}

{#snippet supportingIcon()}
  <GroupIcon />
{/snippet}

{#snippet crewIcon()}
  <CrewIcon />
{/snippet}

{#if options.length > 1}
  <Toggler {value} {onChange} {options} />
{/if}
