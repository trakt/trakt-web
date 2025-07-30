<script lang="ts">
  const { title, style }: { title: string; style: "primary" | "secondary" } =
    $props();
</script>

<h5 class="shadow-list-title ellipsis" data-style={style}>{title}</h5>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .shadow-list-title {
    &[data-style="primary"] {
      color: var(--color-text-primary);
    }

    &[data-style="secondary"] {
      color: var(--color-text-secondary);
    }

    /** FIXME: remove when we have adaptive typography and updated sizes */
    font-size: var(--font-size-18);
  }
</style>
