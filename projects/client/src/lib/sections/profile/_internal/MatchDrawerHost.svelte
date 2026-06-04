<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import MatchDrawer from "../components/MatchDrawer.svelte";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps.ts";
  import { useMatch } from "./useMatch.ts";

  type MatchDrawerHostProps = DisplayableProfileProps & {
    onClose: () => void;
  };

  const { slug, profile, onClose }: MatchDrawerHostProps = $props();

  const { mode } = useDiscover();
  const { match } = $derived(useMatch({ slug, mode: $mode }));
</script>

{#if $match}
  <MatchDrawer match={$match} {profile} {onClose} />
{/if}
