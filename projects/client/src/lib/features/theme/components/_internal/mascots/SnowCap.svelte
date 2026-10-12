<div class="trakt-snow-cap" aria-hidden="true">
  <svg class="snow-pile" viewBox="0 0 100 10" preserveAspectRatio="none">
    <path
      d="M0 10C2 6 6 5 9 7c3-6 11-6 15-1 4-4 10-4 14 0 5-6 14-5 18 0 4-4 10-4 14 0 5-5 14-5 18 0 4-3 9-2 12 4z"
    />
  </svg>

  <div class="snow-frost"></div>
</div>

<style>
  .trakt-snow-cap {
    position: absolute;
    inset: 0;
    border-radius: inherit;

    .snow-pile {
      position: absolute;
      bottom: calc(100% - var(--ni-2));
      inset-inline: var(--ni-12);

      width: calc(100% - 2 * var(--ni-12));
      height: var(--ni-8);

      fill: var(--shade-10);
    }

    .snow-frost {
      position: absolute;
      inset: 0;
      border-radius: inherit;

      background: linear-gradient(
        var(--shade-10) var(--ni-4),
        transparent var(--ni-4)
      );
    }
  }
</style>
