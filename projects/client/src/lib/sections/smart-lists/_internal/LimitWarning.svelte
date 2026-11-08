<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import UsageLimitWarning from "$lib/sections/components/UsageLimitWarning.svelte";
</script>

<UsageLimitWarning
  warningClass="trakt-smart-lists-limit"
  source="smart-list"
  upsellTitle={m.text_vip_upsell_more_lists()}
  upsellMessage={m.text_vip_upsell_smart_lists()}
  vipMessage={m.warning_smart_lists_limit()}
/>
