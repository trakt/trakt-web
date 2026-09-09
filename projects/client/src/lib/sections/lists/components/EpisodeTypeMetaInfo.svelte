<script lang="ts">
  import { useEpisodeType } from "$lib/features/calendar/useEpisodeType";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";

  const { current, isApplicable } = useEpisodeType();
</script>

{#if $isApplicable}
  <ListMetaInfo text={$current.text()} />
{/if}
