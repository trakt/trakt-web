<script lang="ts">
  import PlugIcon from "$lib/components/icons/PlugIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ConnectedApp } from "$lib/requests/models/ConnectedApp.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import RevokeConnectedAppButton from "./RevokeConnectedAppButton.svelte";

  const { app }: { app: ConnectedApp } = $props();

  const description = $derived(
    [
      m.text_app_connected_on({
        date: toHumanDate(new Date(), app.connectedAt, getLocale()),
      }),
      m.text_app_last_used({
        date: toHumanDate(new Date(), app.lastUsedAt, getLocale()),
      }),
    ].join(" · "),
  );
</script>

<SettingsGroupRow title={app.name} {description} variant="custom">
  {#snippet icon()}
    <PlugIcon />
  {/snippet}

  <RevokeConnectedAppButton {app} />
</SettingsGroupRow>
