<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import { m } from "$lib/paraglide/messages";
  import YirPageInner from "./YirPageInner.svelte";
</script>

<RenderFor audience="free">
  <section class="yir-vip-page">
    <YirPageInner>
      <div class="yir-upgrade-content">
        <div class="yir-go-vip">
          <p class="yir-upgrade-text">
            {m.yir_upgrade_message()}
          </p>
          <GetVIPLink source="yir" />
        </div>
      </div>
    </YirPageInner>
  </section>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-vip-page {
    position: relative;
    background-color: var(--shade-950);
  }

  .yir-upgrade-content {
    text-align: center;
    padding: var(--ni-72) 0;
  }

  .yir-go-vip {
    margin: 0 auto;
    background: var(--shade-950);
    width: var(--ni-380);
    max-width: 75%;
    font-size: 16px;
    box-shadow: 0 0 var(--ni-52) var(--red-800);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--ni-20);
    transition: all 0.5s;
    gap: var(--gap-m);

    &:hover {
      background: var(--shade-930);
    }

    @include for-mobile {
      max-width: 90%;
      font-size: 14px;
    }
  }

  .yir-upgrade-text {
    color: var(--shade-10);
  }
</style>
