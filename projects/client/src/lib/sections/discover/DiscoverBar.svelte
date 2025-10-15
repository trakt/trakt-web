<script lang="ts">
  import { page } from "$app/state";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";

  const { mode: selectedType, setMode, options, routes } = useDiscover();

  const isOnDiscoverablePage = $derived($routes.includes(page.route.id ?? ""));
</script>

<RenderForFeature flag={FeatureFlag.Discover}>
  {#snippet enabled()}
    {#if isOnDiscoverablePage}
      <div class="trakt-toggle-bar">
        <Toggler
          value={$selectedType}
          variant="text"
          onChange={setMode}
          {options}
        />
      </div>
    {/if}
  {/snippet}
</RenderForFeature>

<style>
  .trakt-toggle-bar {
    display: flex;
    justify-content: center;
    gap: var(--gap-micro);

    padding: var(--gap-m);
    margin-top: env(safe-area-inset-top);
  }
</style>
