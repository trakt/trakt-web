<script lang="ts">
  const {
    title,
    description,
    children,
  }: ChildrenProps & { title: string; description: string } = $props();
</script>

<div class="trakt-settings-block">
  <div class="trakt-settings-block-header">
    <p class="meta-info">{title}</p>
    <p class="smaller secondary">{description}</p>
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

    p.meta-info {
      transition: font-size var(--transition-increment) ease-in-out;
      text-transform: capitalize;
      font-size: var(--ni-24);
    }

    @include for-tablet-sm-and-below {
      p.meta-info {
        text-transform: uppercase;
        font-size: var(--ni-14);
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
