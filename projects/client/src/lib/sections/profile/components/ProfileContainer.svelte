<script lang="ts">
  import type { Snippet } from "svelte";

  type ProfileContainerProps = {
    details?: Snippet;
  } & ChildrenProps;

  const { details, children }: ProfileContainerProps = $props();
</script>

<div class="trakt-profile-container">
  {#if details}
    <div class="trakt-profile-details">
      {@render details()}
    </div>
  {/if}
  <div class="trakt-profile-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-container {
    display: grid;
    gap: var(--gap-xl);
    grid-template-columns: 1fr 3fr;
    margin: 0 var(--layout-distance-side);

    @include for-desktop {
      max-width: 75dvw;
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
      margin: 0 var(--ni-16);

      .trakt-profile-content {
        grid-column: 1;
      }
    }
  }

  .trakt-profile-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
