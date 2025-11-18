<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import JoinForFree from "./components/JoinForFree.svelte";
  import LoginButton from "./components/LoginButton.svelte";
  import Steps from "./components/Steps.svelte";
  import TraktApps from "./components/TraktApps.svelte";

  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AppStoreBadge from "./assets/AppStoreBadge.svelte";
  import GooglePlayBadge from "./assets/GooglePlayBadge.svelte";
  import popcorn from "./assets/popcorn.png";
  import ExploreLabels from "./components/ExploreLabels.svelte";
  import LandingColumns from "./components/LandingColumns.svelte";
  import TrendingItems from "./components/TrendingItems.svelte";
</script>

<div class="trakt-landing">
  <LandingColumns>
    {#snippet left()}
      <div class="trakt-landing-logo">
        <Logo />
      </div>
      <TrendingItems type="show">
        <ExploreLabels text="shows" />
        <ShowIcon />
      </TrendingItems>
    {/snippet}

    <Steps />
    <JoinForFree />

    {#snippet right()}
      <div class="trakt-landing-login">
        <LoginButton />
      </div>
      <TrendingItems type="movie">
        <MovieIcon />
        <ExploreLabels text="movies" />
      </TrendingItems>
    {/snippet}
  </LandingColumns>

  <LandingColumns>
    {#snippet left()}
      <RenderFor audience="public" device={["tablet-lg", "desktop"]}>
        <Link href={UrlBuilder.app.ios()} target="_blank">
          <AppStoreBadge />
        </Link>
      </RenderFor>
    {/snippet}

    <TraktApps />

    {#snippet right()}
      <RenderFor audience="public" device={["tablet-lg", "desktop"]}>
        <Link href={UrlBuilder.app.android()} target="_blank">
          <GooglePlayBadge />
        </Link>
      </RenderFor>
    {/snippet}
  </LandingColumns>

  <!-- svelte-ignore a11y_img_redundant_alt -->
  <img src={popcorn} class="trakt-popcorn" alt="Popcorn image" />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing {
    --landing-padding: var(--ni-48);
    --landing-gap: var(--ni-96);

    --popcorn-height: var(--ni-200);
    --popcorn-safe-area: var(--popcorn-height);

    position: absolute;
    left: 0;
    top: 0;
    width: calc(
      100dvw - 2 * var(--landing-padding) - var(--layout-scrollbar-width)
    );
    min-height: calc(
      100dvh - var(--landing-padding) - var(--popcorn-safe-area)
    );

    overflow-x: hidden;

    display: flex;
    flex-direction: column;
    gap: var(--landing-gap);

    padding: var(--landing-padding);
    padding-bottom: var(--popcorn-safe-area);

    background: radial-gradient(
      1000px 1000px at 50% 100%,
      color-mix(in srgb, var(--purple-500) 30%, transparent) 0%,
      transparent 100%
    );

    transition: var(--transition-increment) ease-in-out;
    transition-property: padding;

    :global(.trakt-landing-content-left) {
      :global(.trakt-landing-trending-items) {
        justify-content: end;
        justify-items: end;
      }
    }

    @include for-tablet-lg-and-below {
      --landing-padding: var(--ni-24);
    }

    @include for-tablet-sm-and-below {
      :global(.trakt-explore-labels) {
        display: none;
      }
    }
  }

  .trakt-landing-login {
    display: flex;
    justify-content: flex-end;
  }

  .trakt-landing-logo {
    display: flex;
    align-self: flex-start;

    :global(svg) {
      flex-shrink: 0;
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

    width: var(--ni-640);
    height: var(--popcorn-height);
  }
</style>
