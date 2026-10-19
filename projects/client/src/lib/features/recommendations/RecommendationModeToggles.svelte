<script lang="ts">
  import BrainIcon from "$lib/components/icons/BrainIcon.svelte";
  import RecentIcon from "$lib/components/icons/RecentIcon.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useRecommendationMode } from "./useRecommendationMode";

  const { current, options, isApplicable, onModeChange } =
    useRecommendationMode();

  const togglerOptions = options.map((option) => ({
    ...option,
    icon: option.value === "smart" ? smartIcon : classicIcon,
  }));
</script>

{#snippet smartIcon()}
  <BrainIcon />
{/snippet}

{#snippet classicIcon()}
  <RecentIcon />
{/snippet}

{#if $isApplicable}
  <Toggler
    value={$current.value}
    onChange={onModeChange}
    options={togglerOptions}
  />
{/if}
