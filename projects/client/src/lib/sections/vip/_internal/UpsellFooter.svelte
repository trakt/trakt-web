<script lang="ts">
  import BuiltToLast from "./BuiltToLast.svelte";
  import JoinNow from "./JoinNow.svelte";
</script>

<div class="trakt-vip-footer">
  <BuiltToLast />
  <JoinNow />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-footer {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(2, minmax(0, var(--ni-480)));
    gap: var(--gap-l);
    justify-content: center;

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, var(--ni-480));
    }
  }
</style>
