<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import UsageLimitWarning from "$lib/sections/components/UsageLimitWarning.svelte";
</script>

<UsageLimitWarning
  warningClass="trakt-connected-apps-limit-warning"
  source="connected-apps"
  upsellMessage={m.warning_connected_apps_limit()}
  vipMessage={m.warning_connected_apps_limit_vip()}
/>
