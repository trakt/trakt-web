<script lang="ts">
  import HourglassIcon from "$lib/components/icons/HourglassIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
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

<RenderForFeature
  flag={FeatureFlag.AnticipatedRecommendations}
  audience="director"
>
  {#snippet enabled()}
    <Toggler
      value={$current.value}
      onChange={onModeChange}
      options={togglerOptions}
    />
  {/snippet}
</RenderForFeature>
