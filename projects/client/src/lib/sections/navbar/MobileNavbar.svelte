<script lang="ts">
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import HomeIcon from "$lib/components/icons/mobile/HomeIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { fade } from "svelte/transition";
  import ProfileImage from "../profile-banner/ProfileImage.svelte";
  import { useNavbarState } from "./useNavbarState";

  const { state } = useNavbarState();

  const { user } = useUser();

  // FIXME: remove when we have well defined dimensions for navbar contextual content
  const { observedDimension, observeDimension } =
    useDimensionObserver("height");

  const hasContextualActions = $derived(
    !!$state.contextualActions || !!$state.toastActions,
  );
</script>

{#if $state.mode !== "hidden"}
  <div
    class="trakt-mobile-navbar"
    class:has-contextual-content={hasContextualActions}
    style="--contextual-height: {$observedDimension}px;"
  >
    {#if $state.toastActions || $state.contextualActions}
      <div
        class="trakt-mobile-navbar-actions"
        use:observeDimension
        in:fade={{ duration: 150, delay: 150 }}
      >
        {#if $state.contextualActions}
          {@render $state.contextualActions()}
        {:else}
          {@render $state.toastActions?.()}
        {/if}
      </div>
    {/if}

    <div class="trakt-mobile-navbar-links">
      <Link href={UrlBuilder.home()}>
        <div class="trakt-mobile-navbar-link">
          <HomeIcon />
        </div>
      </Link>

      <RenderFor audience="authenticated">
        <Link href={UrlBuilder.discover()}>
          <div class="trakt-mobile-navbar-link">
            <DiscoverIcon />
          </div>
        </Link>

        <Link href={UrlBuilder.lists.user("me")}>
          <div class="trakt-mobile-navbar-link">
            <ListIcon />
          </div>
        </Link>

        <Link href={UrlBuilder.search()}>
          <div class="trakt-mobile-navbar-link">
            <SearchIcon />
          </div>
        </Link>

        <Link href={UrlBuilder.profile.me()}>
          <div class="trakt-mobile-navbar-link">
            <ProfileImage
              --width="var(--ni-24)"
              --height="var(--ni-24)"
              --border-width="var(--border-thickness-xs)"
              name={$user?.name?.first ?? ""}
              src={$user?.avatar?.url ?? ""}
              isVip={Boolean($user?.isVip)}
            />
          </div>
        </Link>
      </RenderFor>
    </div>
  </div>

  <div
    class="trakt-mobile-navbar-spacer"
    class:has-contextual-content={hasContextualActions}
    style="--contextual-height: {$observedDimension}px;"
  ></div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .trakt-mobile-navbar-spacer,
  .trakt-mobile-navbar {
    contain: layout;

    padding: var(--ni-12) 0;
    padding-bottom: calc(var(--ni-12) + env(safe-area-inset-bottom, 0));
    height: var(--mobile-navbar-height);
    box-sizing: border-box;

    &.has-contextual-content {
      --contextual-spacing: calc(var(--contextual-height) + var(--gap-m));
      height: calc(var(--mobile-navbar-height) + var(--contextual-spacing));
    }
  }

  .trakt-mobile-navbar {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--layer-overlay);

    background-color: var(--color-background-mobile-navbar);
    box-shadow: 0px -24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent);

    border-top-left-radius: var(--border-radius-xxl);
    border-top-right-radius: var(--border-radius-xxl);

    transition: var(--transition-increment) ease-in-out;
    transition-property: height, gap;

    &.has-contextual-content {
      gap: var(--gap-m);
    }

    backdrop-filter: blur(var(--ni-8));
  }

  .trakt-mobile-navbar-links {
    flex-shrink: 0;

    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: var(--gap-s);

    height: var(--ni-32);
  }

  .trakt-mobile-navbar-link {
    width: var(--ni-60);
    transition: color var(--transition-increment) ease-in-out;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  :global(.trakt-link.trakt-link-active) {
    .trakt-mobile-navbar-link {
      color: var(--purple-400);
    }
  }

  .trakt-mobile-navbar-actions {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: var(--ni-4) var(--ni-20);
    box-sizing: border-box;

    gap: var(--gap-s);
  }
</style>
