<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import UpsellLink from "$lib/features/upsell/UpsellLink.svelte";
</script>

<UpsellLink>
  <span class="meta-info">{m.link_text_vip_cover_image_upsell()}</span>
</UpsellLink>

<style>
  .meta-info {
    max-width: var(--ni-96);
  }
</style>
