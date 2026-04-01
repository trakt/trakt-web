<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import { m } from "$lib/paraglide/messages";
</script>

<RenderFor audience="free">
  <section class="yir-vip-page">
    <div class="yir-page-inner">
      <div class="yir-go-vip">
        <p class="yir-upgrade-text">
          {m.yir_upgrade_message()}
        </p>
        <GetVIPLink source="yir" />
      </div>
    </div>
  </section>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-vip-page {
    position: relative;
    background-color: var(--shade-950);
  }

  .yir-page-inner {
    text-align: center;
    padding: 70px 0;
    max-width: 1170px;
    margin: 0 auto;

    @include for-tablet-sm-and-below {
      max-width: 750px;
    }

    @include for-mobile {
      max-width: 100%;
    }
  }

  .yir-go-vip {
    margin: 0 auto;
    background: var(--shade-950);
    width: 424px;
    max-width: 75%;
    font-size: 16px;
    box-shadow: 0 0 50px #af0000;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--ni-20);
    transition: all 0.5s;
    gap: var(--gap-m);

    &:hover {
      background: #161616;
    }

    @include for-mobile {
      max-width: 90%;
      font-size: 14px;
    }
  }

  .yir-upgrade-text {
    color: #fff;
  }
</style>
