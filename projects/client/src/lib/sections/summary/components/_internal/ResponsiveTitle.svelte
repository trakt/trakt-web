<script lang="ts">
  const { title }: { title: string } = $props();
</script>

<h1
  class="trakt-responsive-title"
  class:short-title={title.length < 15}
  class:long-title={title.length > 25}
>
  {title}
</h1>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-responsive-title {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-48));

    @include for-tablet-sm-and-below {
      font-size: initial;
    }
  }
</style>
