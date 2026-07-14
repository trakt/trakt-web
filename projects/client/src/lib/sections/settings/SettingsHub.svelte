<script lang="ts">
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import Profile from "./_internal/Profile.svelte";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRow from "./_internal/SettingsGroupRow.svelte";
  import { settingsPages } from "./_internal/settingsPages.ts";

  type SettingsPage = (typeof settingsPages)[number];
</script>

{#snippet categoryRow(page: SettingsPage)}
  {@const Icon = page.icon}
  <SettingsGroupRow
    title={page.label()}
    variant="link"
    href={page.hubHref ?? page.href}
  >
    {#snippet icon()}
      <Icon />
    {/snippet}
  </SettingsGroupRow>
{/snippet}

<div class="trakt-settings-hub">
  <Profile />

  <SettingsGroupCard>
    {#each settingsPages as page (page.href)}
      {#if page.flag}
        <RenderForFeature flag={page.flag}>
          {#snippet enabled()}
            {@render categoryRow(page)}
          {/snippet}
        </RenderForFeature>
      {:else}
        {@render categoryRow(page)}
      {/if}
    {/each}
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-settings-hub {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    min-width: 0;
  }
</style>
