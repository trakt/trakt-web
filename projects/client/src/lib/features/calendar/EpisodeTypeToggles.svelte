<script lang="ts">
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useEpisodeType } from "./useEpisodeType";

  const { episodeType, onEpisodeTypeChange, options, isApplicable } =
    useEpisodeType();
  const { mode } = useDiscover();

  const togglerOptions = options.map((option) =>
    option.value === "all" ? { ...option, icon: discoverModeIcon } : option
  );
</script>

{#snippet discoverModeIcon()}
  {#if $mode === "movie"}
    <MovieIcon />
  {:else if $mode === "show"}
    <ShowIcon />
  {:else}
    <MediaIcon />
  {/if}
{/snippet}

{#if $isApplicable}
  <Toggler
    value={$episodeType}
    onChange={onEpisodeTypeChange}
    options={togglerOptions}
  />
{/if}
