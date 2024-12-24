<script lang="ts">
  import type { Snippet } from "svelte";

  type ProfileContainerProps = {
    details?: Snippet;
    contextualContent?: Snippet;
  } & ChildrenProps;

  const {
    details,
    contextualContent: content,
    children,
  }: ProfileContainerProps = $props();
</script>

<!-- TODO extract duplication with summary container -->
<div class="trakt-profile-container">
  {#if details}
    <div class="trakt-profile-details">
      {@render details()}
    </div>
  {/if}
  <div class="trakt-profile-content">
    {@render children()}
  </div>
  {#if content}
    <div class="trakt-profile-contextual-content">
      {@render content()}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/mixins/index" as *;

  .trakt-profile-container {
    display: grid;
    gap: var(--ni-32);
    grid-template-columns: 1fr 2fr 1fr;
    margin: 0 var(--ni-56);

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
      margin: 0 var(--ni-16);

      .trakt-profile-details {
        display: none;
      }

      .trakt-profile-content {
        grid-column: 1;
      }
    }
  }

  .trakt-profile-details,
  .trakt-profile-contextual-content {
    justify-self: center;
  }

  .trakt-profile-content {
    align-self: end;
    grid-column: 2;
  }
</style>
