<script lang="ts">
  import BrainIcon from "$lib/components/icons/BrainIcon.svelte";
  import RecentIcon from "$lib/components/icons/RecentIcon.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
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

<RenderForFeature flag={FeatureFlag.PersonalizedRelated} audience="director">
  {#snippet enabled()}
    <Toggler
      value={$current.value}
      onChange={onModeChange}
      options={togglerOptions}
    />
  {/snippet}
</RenderForFeature>
