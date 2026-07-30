<script lang="ts">
  import type { OfficialApp } from "./OfficialApp.ts";

  type AppDestination = OfficialApp["destinations"][number];

  const {
    app,
    destination,
  }: {
    app: OfficialApp;
    destination: AppDestination;
  } = $props();
</script>

<li class="trakt-official-app-tile">
  <a
    class="tile-content"
    href={destination.href}
    target="_blank"
    rel="external noreferrer"
  >
    <span class="app-icon" data-store={destination.store}>
      <img src={app.iconUrl} alt="" loading="lazy" decoding="async" />
    </span>

    <span class="app-name small">{app.name}</span>
  </a>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-official-app-tile {
    min-width: 0;
  }

  .tile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);

    min-width: 0;
    height: 100%;
    padding: var(--ni-8);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    color: inherit;
    text-decoration: none;

    -webkit-tap-highlight-color: transparent;
    cursor: pointer;

    transition: background var(--transition-increment) ease-in-out;

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-background-purple);
      outline-offset: var(--ni-2);
    }

    @include for-mouse {
      &:hover {
        background: color-mix(
          in srgb,
          var(--color-foreground) 5%,
          transparent
        );
      }
    }

    &:active {
      background: color-mix(
        in srgb,
        var(--color-foreground) 8%,
        transparent
      );
    }
  }

  .app-icon {
    display: block;
    width: 70%;
    max-width: calc(var(--ni-96) * 0.7);
    aspect-ratio: 1;

    overflow: hidden;

    &[data-store="google-play"] {
      border-radius: 50%;
    }

    &[data-store="app-store"] {
      border-radius: calc(var(--border-radius-l) - var(--ni-1));
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .app-name {
    max-width: 100%;

    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;

    line-height: 1.25;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    text-align: center;
  }
</style>
