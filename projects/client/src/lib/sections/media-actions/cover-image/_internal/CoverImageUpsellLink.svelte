<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import UpsellLink from "$lib/features/upsell/UpsellLink.svelte";
</script>

<UpsellLink>
  <span class="bold">{m.link_text_vip_cover_image_upsell()}</span>
</UpsellLink>

<style>
  span {
    max-width: var(--ni-96);
  }
</style>
