<script lang="ts">
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import type { NavigationProps } from "./NavigationProps";

  const { children, navigation }: ChildrenProps & NavigationProps = $props();

  const { navigation: navigationContext } = useNavigation();

  const isAvailableForNavigation = $derived(
    navigation === "all" || navigation === $navigationContext,
  );
</script>

{#if isAvailableForNavigation}
  {@render children()}
{/if}
