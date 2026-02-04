<script lang="ts">
  import type { Snippet } from "svelte";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";

  const {
    children,
    details,
    profile,
  }: ChildrenProps & DisplayableProfileProps & { details: Snippet } = $props();
</script>

<div class="trakt-profile-container" class:is-vip={profile.isVip}>
  <!-- TODO: this div and styling should not be in this component -->
  <div class="trakt-profile-main-content">
    {@render children()}
  </div>

  {@render details()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-container {
    width: calc(100% - 2 * var(--layout-distance-side));
    height: var(--ni-232);
    margin: 0 var(--layout-distance-side);

    border-radius: var(--border-radius-l);
    /* TODO: light mode check + this is veeeeeery purple */
    background: linear-gradient(90deg, #1e1031 0%, #301a4e 100%);

    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--gap-m);

    padding: var(--ni-24);
    box-sizing: border-box;

    transition: var(--transition-increment) ease-in-out;
    transition-property: padding;

    &.is-vip {
      background: radial-gradient(
        50% 39.27% at 50% 0%,
        #500d0e 0%,
        #191c1e 100%
      );
    }

    @include for-tablet-lg {
      grid-template-columns: 1fr 1fr;
    }

    @include for-tablet-sm-and-below {
      padding: 0;
      background: none;
      grid-template-columns: 1fr;
      height: auto;

      &.is-vip {
        background: none;
      }
    }
  }

  .trakt-profile-main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }
</style>
