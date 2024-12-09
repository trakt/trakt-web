<script lang="ts">
  import androidScreenshot from "../assets/screenshot_android.png?enhanced";
  import iosScreenshot from "../assets/screenshot_ios.png?enhanced";
</script>

<div class="trakt-phones">
  <!--
    TODO: extract to generic component;
    Params: variant to indicate iphone/android phone + screenshot source
   -->
  <enhanced:img
    src={androidScreenshot}
    class="trakt-background-phone"
    alt="Android screenshot"
  />
  <enhanced:img
    src={iosScreenshot}
    class="trakt-foreground-phone"
    alt="iOS screenshot"
  />
</div>

<style>
  .trakt-phones {
    position: relative;

    .trakt-foreground-phone {
      position: relative;
      width: var(--ni-300);
      height: auto;
      max-width: 100%;
    }

    .trakt-background-phone {
      position: absolute;
      left: 75%;
      top: var(--ni-neg-128);
      width: var(--ni-312);
      height: auto;
      max-width: 100%;
    }
  }
</style>
