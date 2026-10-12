<svg class="trakt-bat-silhouette" viewBox="0 0 40 20" aria-hidden="true">
  <path
    class="bat-wing"
    d="M18 9C14 3 7 2 1 6c3 1 5 3 5 5 2-2 4-1 5 1 2-2 4-2 7 0z"
  />
  <path
    class="bat-wing is-mirrored"
    d="M22 9c4-6 11-7 17-3-3 1-5 3-5 5-2-2-4-1-5 1-2-2-4-2-7 0z"
  />
  <path
    class="bat-body"
    d="M18 7l.6-2.4L19.4 6.5h1.2l.8-1.9L22 7c.6 1.2.6 3.8 0 5.2-.6 1.4-3.4 1.4-4 0-.6-1.4-.6-4 0-5.2z"
  />
</svg>

<style>
  .trakt-bat-silhouette {
    width: 100%;
    height: 100%;

    fill: var(--bat-color, var(--color-seasonal-silhouette));

    .bat-wing {
      transform-box: fill-box;
      transform-origin: right center;
      animation: bat-flap 0.28s ease-in-out infinite alternate;

      &.is-mirrored {
        transform-origin: left center;
      }
    }
  }

  @keyframes bat-flap {
    from {
      transform: scaleY(1);
    }
    to {
      transform: scaleY(-0.35);
    }
  }
</style>
