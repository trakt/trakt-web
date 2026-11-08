<script lang="ts">
  import { revealOnView } from "$lib/utils/actions/revealOnView";
  import BuiltToLast from "./BuiltToLast.svelte";
  import IncreasedLimits from "./IncreasedLimits.svelte";
  import JoinNow from "./JoinNow.svelte";
</script>

<div class="trakt-vip-footer">
  <div class="trakt-vip-footer-item" use:revealOnView={{ delay: 0 }}>
    <IncreasedLimits />
  </div>
  <div class="trakt-vip-footer-item" use:revealOnView={{ delay: 120 }}>
    <BuiltToLast />
  </div>
  <div class="trakt-vip-footer-item" use:revealOnView={{ delay: 240 }}>
    <JoinNow />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-footer-item {
    display: flex;

    > :global(.trakt-vip-glass-card) {
      flex: 1;
      min-width: 0;
    }

    @media (prefers-reduced-motion: no-preference) {
      &:not([data-reveal="pending"]) :global(.trakt-vip-icon-circle::after) {
        animation: vip-footer-halo 1200ms ease-out 500ms both;
      }
    }
  }

  @keyframes vip-footer-halo {
    from {
      opacity: 0.5;
      transform: scale(1);
    }

    to {
      opacity: 0;
      transform: scale(1.7);
    }
  }

  .trakt-vip-footer {
    width: 100%;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, var(--ni-480)));
    gap: var(--gap-l);
    justify-content: center;

    @include for-tablet-lg {
      grid-template-columns: repeat(2, minmax(0, var(--ni-480)));

      & > :global(:first-child) {
        grid-column: 1 / -1;
      }
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, var(--ni-480));
    }

    @include for-mobile {
      padding-block-end: var(--vip-sticky-join-height);
    }
  }
</style>
