<script lang="ts">
  const {
    title,
    description,
    children,
  }: ChildrenProps & { title: string; description: string } = $props();
</script>

<div class="trakt-settings-block">
  <div class="trakt-settings-block-header">
    <p class="settings-title">{title}</p>
    <p class="secondary">{description}</p>
  </div>
  <div class="trakt-settings-block-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-block-header {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xs);

    p.settings-title {
      transition: font-size var(--transition-increment) ease-in-out;
      text-transform: capitalize;
      font-size: var(--font-size-title);
    }

    @include for-tablet-sm-and-below {
      p.meta-info {
        text-transform: uppercase;
        font-size: var(--font-size-text);
      }
    }
  }

  .trakt-settings-block,
  .trakt-settings-block-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }
</style>
