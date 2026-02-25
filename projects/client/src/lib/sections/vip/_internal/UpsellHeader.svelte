<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktIcon from "./icons/TraktIcon.svelte";
  import VipHeader from "./VipHeader.svelte";
</script>

<VipHeader>
  {#snippet icon()}
    <TraktIcon />
  {/snippet}

  Unlock more with Trakt <VipBadge />

  {#snippet description()}
    <span class="secondary">
      {m.text_vip_get_insights()}
    </span>
    <span class="secondary">
      {m.text_vip_mission_statement()}
    </span>
  {/snippet}
</VipHeader>
