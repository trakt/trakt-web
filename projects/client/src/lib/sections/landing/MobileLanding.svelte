<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import JoinForFree from "./components/JoinForFree.svelte";
  import LoginButton from "./components/LoginButton.svelte";
  import Steps from "./components/Steps.svelte";
  import TraktApps from "./components/TraktApps.svelte";

  import popcorn from "./assets/popcorn.png";
</script>

<div class="trakt-landing">
  <div class="trakt-landing-content">
    <div class="trakt-landing-buttons">
      <Logo />
      <LoginButton />
    </div>

    <Steps />

    <JoinForFree />
  </div>

  <TraktApps />

  <!-- svelte-ignore a11y_img_redundant_alt -->
  <img src={popcorn} class="trakt-popcorn" alt="Popcorn image" />
</div>

<style>
  .trakt-landing {
    --content-padding: var(--ni-12);
    --popcorn-height: var(--ni-200);

    display: flex;
    flex-direction: column;

    position: relative;

    gap: var(--gap-xxl);
    padding: var(--content-padding);
    padding-bottom: var(--popcorn-height);

    overflow-x: hidden;

    background: radial-gradient(
      200dvw 200dvw at 50% 100%,
      color-mix(in srgb, var(--purple-500) 50%, transparent) 0%,
      transparent 100%
    );
  }

  .trakt-landing-content {
    --safe-height: calc(
      100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)
    );

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: var(--gap-m);

    margin-top: env(safe-area-inset-top, 0px);
    min-height: calc(var(--safe-height) - 2 * var(--content-padding));
  }

  .trakt-landing-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > :global(svg) {
      height: var(--ni-32);
      width: auto;
    }
  }

  .trakt-popcorn {
    position: absolute;

    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    object-fit: cover;
    object-position: top;

    width: var(--ni-520);
    height: var(--popcorn-height);
  }
</style>
