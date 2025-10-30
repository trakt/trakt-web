<script lang="ts">
  import { page } from "$app/state";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import SeasonalToggle from "$lib/features/theme/components/SeasonalToggle.svelte";

  const { mode: selectedType, setMode, options, routes } = useDiscover();

  const isOnDiscoverablePage = $derived($routes.includes(page.route.id ?? ""));
</script>

{#if isOnDiscoverablePage}
  <div class="trakt-toggle-bar">
    <Toggler
      value={$selectedType}
      variant="text"
      onChange={setMode}
      {options}
    />
    <SeasonalToggle />
  </div>
{/if}

<style>
  .trakt-toggle-bar {
    display: flex;
    justify-content: center;
    align-items: center;

    gap: var(--gap-m);

    padding: var(--gap-m);
    margin-top: env(safe-area-inset-top);
  }
</style>
