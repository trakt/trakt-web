<script lang="ts">
  import BrainIcon from "$lib/components/icons/BrainIcon.svelte";
  import RecentIcon from "$lib/components/icons/RecentIcon.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import ModeToggles from "./_internal/ModeToggles.svelte";
  import { useRelatedMode } from "./useRelatedMode";

  const { current, options, onModeChange } = useRelatedMode();

  const togglerOptions = options.map((option) => ({
    ...option,
    icon: option.value === "personal" ? personalIcon : standardIcon,
  }));
</script>

{#snippet personalIcon()}
  <BrainIcon />
{/snippet}

{#snippet standardIcon()}
  <RecentIcon />
{/snippet}

<ModeToggles
  flag={FeatureFlag.PersonalizedRelated}
  value={$current.value}
  options={togglerOptions}
  onChange={onModeChange}
/>
