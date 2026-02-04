<script lang="ts">
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
</script>

<div class="trakt-vip-upsell">
  <h1 class="bold">
    <!-- {m.text_vip_upsell()} -->
    Enhance your trakt experience
  </h1>
  <p>
    <!-- {m.text_vip_upsell_description()} -->
    Upgrade to VIP and unlock the full Trakt experience, packed with features built
    for TV shows and movie lovers.
  </p>
  <GetVIPLink source="profile" />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-upsell {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-m);

    background: var(--background-vip-drawer);
    border-radius: var(--border-radius-l);

    padding: var(--ni-24);
    box-sizing: border-box;

    @include for-mobile {
      padding: var(--ni-16);
    }
  }
</style>
