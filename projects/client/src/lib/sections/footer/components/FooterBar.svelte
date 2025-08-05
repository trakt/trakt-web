<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-footer-bar" data-dpad-navigation={DpadNavigationType.List}>
  {@render children?.()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-footer-bar {
    padding: var(--footer-bar-padding);
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: var(--gap-s);

    @include for-tablet-sm-and-below {
      padding: var(--ni-12);
    }
  }
</style>
