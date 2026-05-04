<script lang="ts">
  import BuiltToLast from "./BuiltToLast.svelte";
  import IncreasedLimits from "./IncreasedLimits.svelte";
  import JoinNow from "./JoinNow.svelte";
</script>

<div class="trakt-vip-footer">
  <IncreasedLimits />
  <BuiltToLast />
  <JoinNow />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-footer {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, var(--ni-480)));
    gap: var(--gap-l);
    justify-content: center;

    @include for-tablet-lg {
      grid-template-columns: repeat(2, minmax(0, var(--ni-480)));

      & > :global(:first-child) {
        grid-column: 1 / -1;
      }
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, var(--ni-480));
    }
  }
</style>
