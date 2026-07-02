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

  <img src={popcorn} class="trakt-popcorn" alt="" />
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

    background-color: #14111b;
    background-image:
      linear-gradient(
        0deg,
        rgba(159, 66, 198, 0.3) 0%,
        transparent 70%
      ),
      radial-gradient(
        110% 90% at 50% 42%,
        rgba(20, 17, 27, 0.45),
        rgba(20, 17, 27, 0.95)
      ),
      linear-gradient(
        180deg,
        #221f2b 0%,
        #2a2336 45%,
        #3a2352 100%
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
