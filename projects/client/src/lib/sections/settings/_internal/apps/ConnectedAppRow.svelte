<script lang="ts">
  import PlugIcon from "$lib/components/icons/PlugIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ConnectedApp } from "$lib/requests/models/ConnectedApp.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import AppRow from "./AppRow.svelte";

  const { app }: { app: ConnectedApp } = $props();

  const connectedOn = $derived(
    toHumanDate(new Date(), app.connectedAt, getLocale()),
  );
  const lastUsedOn = $derived(
    toHumanDate(new Date(), app.lastUsedAt, getLocale()),
  );
</script>

<AppRow title={app.name}>
  {#snippet icon()}
    <PlugIcon />
  {/snippet}

  <span>{m.text_app_connected_on({ date: connectedOn })}</span>
  <span>{m.text_app_last_used({ date: lastUsedOn })}</span>
</AppRow>
