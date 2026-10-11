<span class="trakt-nudge-posters" aria-hidden="true">
  <span class="nudge-poster"></span>
  <span class="nudge-poster"></span>
  <span class="nudge-poster"></span>
</span>

<style lang="scss">
  .trakt-nudge-posters {
    flex-shrink: 0;

    display: flex;
    align-items: center;

    padding-inline-start: var(--ni-4);
  }

  .nudge-poster {
    width: var(--ni-14);
    height: var(--ni-20);
    margin-inline-start: var(--ni-neg-6);

    border: var(--ni-1) solid var(--color-smart-list-nudge-background);
    border-radius: var(--ni-3);

    &:nth-child(1) {
      background: var(--purple-300);
      transform: rotate(-6deg);
    }

    &:nth-child(2) {
      background: var(--purple-500);
      transform: translateY(var(--ni-neg-2));
    }

    &:nth-child(3) {
      background: var(--purple-700);
      transform: rotate(6deg);
    }
  }
</style>
