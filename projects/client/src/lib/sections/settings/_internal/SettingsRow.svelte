<script lang="ts">
  const { title, children }: ChildrenProps & { title: string } = $props();
</script>

<div class="trakt-settings-row">
  <span class="trakt-settings-row-title ellipsis">{title}</span>
  <div class="trakt-settings-row-content">{@render children()}</div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    .trakt-settings-row-title {
      width: var(--ni-200);
    }

    @include for-tablet-sm-and-below {
      .trakt-settings-row-title,
      .trakt-settings-row-content {
        width: auto;
        flex: 1;
      }
    }
  }
</style>
