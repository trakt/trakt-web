<script lang="ts">
  /*
    The backdrop band painted from the poster instead of the artwork: the two
    dominant colours the API reads off the poster (`media.colors`), so the band
    always agrees with the title standing in front of it, whatever the fanart
    happens to be.

    The paint is the shared poster-gradient recipe (header-kit), the same one
    the person masthead's `colors` variant uses. The dissolve is the shared mask
    the artwork uses - same curve, same landing on the poster's base - so
    switching the preview on and off moves nothing but the paint.
  */
  const { colors }: { colors: [string, string] } = $props();
</script>

<div
  class="trakt-masthead-gradient-backdrop"
  aria-hidden="true"
  style:--backdrop-color-one={colors[0]}
  style:--backdrop-color-two={colors[1]}
></div>

<style lang="scss">
  @use "../../../header-kit/backdropDissolve" as dissolve;
  @use "../../../header-kit/posterGradient" as gradient;

  .trakt-masthead-gradient-backdrop {
    position: absolute;
    inset: 0;

    pointer-events: none;

    @include gradient.poster-gradient;

    @include dissolve.backdrop-dissolve;
  }
</style>
