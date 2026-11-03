<!--
  The one bullet the header's lists share: a lit 6px dot with a soft halo,
  centred in a box one text line tall so it sits on the first line whatever
  the text size. The colour comes from `--summary-header-bullet-color`: green
  in Insights to echo the sentiment pill, purple in Trivia.
-->
<span class="trakt-summary-header-bullet-dot" aria-hidden="true"></span>

<style lang="scss">
  .trakt-summary-header-bullet-dot {
    --bullet-color: var(--summary-header-bullet-color, var(--purple-300));

    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    width: var(--ni-8);
    height: var(--summary-header-bullet-line, var(--ni-20));

    &::before {
      content: "";

      width: var(--ni-8);
      height: var(--ni-8);
      border-radius: var(--border-radius-pill);

      background-color: var(--bullet-color);
      box-shadow:
        0 0 0 calc(var(--ni-2) + var(--ni-1))
          color-mix(in srgb, var(--bullet-color) 16%, transparent),
        0 0 var(--ni-10) color-mix(in srgb, var(--bullet-color) 50%, transparent);
    }
  }
</style>
