<script lang="ts">
  const { count, label }: { count: number; label?: string } = $props();
</script>

<span class="trakt-count-badge tag bold">
  {#if label}
    <span class="count-badge-label">{label}</span>
  {/if}
  {count}
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-count-badge {
    display: flex;
    align-items: center;
    justify-content: center;

    min-width: var(--ni-16);
    height: var(--ni-16);
    padding: 0 var(--ni-4);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);
    background-color: var(--purple-500);
    color: var(--shade-10);

    line-height: 1;

    .count-badge-label {
      @include visually-hidden;
    }
  }
</style>
