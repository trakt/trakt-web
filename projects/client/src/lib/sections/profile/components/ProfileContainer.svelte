<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";

  const { children, profile, slug }: ChildrenProps & DisplayableProfileProps =
    $props();

  const { isMe } = $derived(useIsMe(slug));
  const isFreeOtherProfile = $derived(!$isMe && !profile.isVip);
</script>

<div
  class="trakt-profile-container"
  class:is-vip={profile.isVip}
  class:is-narrow={isFreeOtherProfile}
>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-container {
    width: calc(100% - 2 * var(--layout-distance-side));
    max-width: var(--ni-1280);
    height: var(--ni-232);

    overflow: hidden;

    align-self: center;

    border-radius: var(--border-radius-l);
    background: var(--background-profile-details);
    box-shadow: var(--shadow-raised);

    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-m);

    margin: 0 var(--layout-distance-side);
    padding: var(--ni-16);
    box-sizing: border-box;

    transition: padding var(--transition-increment) ease-in-out;

    &.is-vip {
      background: var(--background-vip-profile-details);
    }

    &.is-narrow {
      max-width: var(--ni-640);
    }

    @include for-tablet-sm-and-below {
      padding: 0;
      border-radius: 0;

      background: none;
      box-shadow: none;

      height: auto;
      overflow: visible;

      &.is-vip {
        background: none;
      }
    }
  }
</style>
