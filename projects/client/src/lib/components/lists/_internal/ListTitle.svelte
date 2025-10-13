<script lang="ts">
  const {
    title,
    metaInfo,
    style,
  }: { title: string; metaInfo?: string; style: "primary" | "secondary" } =
    $props();
</script>

<div class="trakt-list-title">
  <h5 class="shadow-list-title ellipsis" data-style={style}>{title}</h5>
  {#if metaInfo}
    <p class="meta-info ellipsis">{metaInfo}</p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-title {
    display: flex;
    flex-direction: column;

    p.meta-info {
      color: var(--list-meta-info-color);
    }
  }

  .shadow-list-title {
    &[data-style="primary"] {
      color: var(--color-text-primary);
    }

    &[data-style="secondary"] {
      color: var(--color-text-secondary);
    }

    /** FIXME: remove when we have adaptive typography and updated sizes */
    font-size: var(--ni-18);
    line-height: var(--ni-18);
  }
</style>
