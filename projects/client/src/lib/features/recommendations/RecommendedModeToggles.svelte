<script lang="ts">
  import HourglassIcon from "$lib/components/icons/HourglassIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import ModeToggles from "./_internal/ModeToggles.svelte";
  import { useRecommendedMode } from "./useRecommendedMode";

  const { current, options, onModeChange } = useRecommendedMode();

  const togglerOptions = options.map((option) => ({
    ...option,
    icon: option.value === "out-now" ? outNowIcon : comingSoonIcon,
  }));
</script>

{#snippet outNowIcon()}
  <PlayIcon />
{/snippet}

{#snippet comingSoonIcon()}
  <HourglassIcon />
{/snippet}

<ModeToggles
  flag={FeatureFlag.AnticipatedRecommendations}
  value={$current.value}
  options={togglerOptions}
  onChange={onModeChange}
/>
