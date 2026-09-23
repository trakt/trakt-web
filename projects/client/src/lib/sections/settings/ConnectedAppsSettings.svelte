<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import ConnectedAppRow from "./_internal/apps/ConnectedAppRow.svelte";
  import ConnectedAppsLimitWarning from "./_internal/apps/ConnectedAppsLimitWarning.svelte";
  import ConnectedAppsUsageMeter from "./_internal/apps/ConnectedAppsUsageMeter.svelte";
  import { useConnectedApps } from "./_internal/apps/useConnectedApps.ts";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRowSkeleton from "./_internal/SettingsGroupRowSkeleton.svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";

  const { apps, isAtLimit, isLoading } = useConnectedApps();
  const { user, limits } = useUser();

  const hasApps = $derived($apps.length > 0);
</script>

<SettingsSection
  title={m.heading_connected_community_apps()}
  description={m.description_connected_apps()}
>
  <!-- VIP users get a generous, invisible limit: the meter would only
       induce anxiety, so it is shown to free accounts only. -->
  {#snippet action()}
    {#if !$isLoading && hasApps && $limits && !$user.isVip}
      <ConnectedAppsUsageMeter
        current={$limits.connectedApps.current}
        limit={$limits.connectedApps.free}
      />
    {/if}
  {/snippet}

  {#if $isLoading}
    <SettingsGroupCard>
      {#each Array(3) as _, index (index)}
        <SettingsGroupRowSkeleton />
      {/each}
    </SettingsGroupCard>
  {:else if !hasApps}
    <p class="secondary">{m.text_no_connected_apps()}</p>
  {:else}
    {#if $isAtLimit}
      <ConnectedAppsLimitWarning />
    {/if}

    <SettingsGroupCard>
      {#each $apps as app (app.key)}
        <ConnectedAppRow {app} />
      {/each}
    </SettingsGroupCard>
  {/if}
</SettingsSection>
