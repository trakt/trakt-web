<script lang="ts">
  import type { Snippet } from "svelte";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";

  const {
    children,
    details,
    profile,
  }: ChildrenProps & DisplayableProfileProps & { details?: Snippet } = $props();
</script>

<div
  class="trakt-profile-container"
  class:is-vip={profile.isVip}
  class:has-details={Boolean(details)}
>
  <!-- TODO: this div and styling should not be in this component -->
  <div class="trakt-profile-main-content">
    {@render children()}
  </div>

  {@render details?.()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-container {
    width: calc(100% - 2 * var(--layout-distance-side));
    max-width: var(--ni-1280);
    height: var(--ni-232);
    overflow: hidden;
    margin: 0 var(--layout-distance-side);

    align-self: center;

    border-radius: var(--border-radius-l);
    /* TODO: light mode check + this is veeeeeery purple */
    background: linear-gradient(90deg, #1e1031 0%, #301a4e 100%);

    display: grid;
    grid-template-columns: 1fr;
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

    &.has-details {
      grid-template-columns: 1fr 2fr;
    }

    @include for-tablet-lg {
      &.has-details {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      }
    }

    @include for-tablet-sm-and-below {
      padding: 0;
      background: none;
      height: auto;

      &.is-vip {
        background: none;
      }

      &.has-details {
        grid-template-columns: 1fr;
      }
    }
  }

  .trakt-profile-main-content {
    display: grid;
    gap: var(--gap-m);
    /* TODO max size on auto */
    grid-template-columns: auto 1fr;

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }
</style>
