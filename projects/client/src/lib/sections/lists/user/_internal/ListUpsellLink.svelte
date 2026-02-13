<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import UpsellLink from "$lib/features/upsell/UpsellLink.svelte";
</script>

<UpsellLink source="lists">
  <span class="bold">{m.link_text_vip_list_upsell()}</span>
</UpsellLink>
