<script lang="ts">
  import WelcomeBackdrop from "./components/WelcomeBackdrop.svelte";
  import WelcomeImport from "./components/WelcomeImport.svelte";
  import WelcomeIntro from "./components/WelcomeIntro.svelte";
</script>

<WelcomeBackdrop />

<div class="trakt-welcome">
  <WelcomeIntro />
  <WelcomeImport />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-welcome {
    --top-bottom-padding: var(--ni-64);

    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    align-self: center;
    max-width: var(--ni-920);
    width: 100%;
    box-sizing: border-box;

    padding: var(--top-bottom-padding) var(--layout-distance-side);

    transition:
      padding var(--transition-increment) ease-in-out,
      gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      --top-bottom-padding: var(--ni-36);
      gap: var(--gap-xl);
    }

    @include for-mobile {
      --top-bottom-padding: var(--ni-24);
    }
  }
</style>
