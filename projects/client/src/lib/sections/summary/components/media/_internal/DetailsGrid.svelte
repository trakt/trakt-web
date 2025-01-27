<script lang="ts">
  type DetailsGridProps = {
    title: string;
  } & ChildrenProps;

  const { title, children }: DetailsGridProps = $props();
</script>

<div class="trakt-summary-details-grid">
  <h5>{title}</h5>
  <div class="trakt-summary-details-grid-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-details-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    h5 {
      transition: font-size calc(var(--transition-increment) * 2) ease-in-out;
    }

    @include for-mobile {
      gap: var(--gap-xs);

      h5 {
        font-size: var(--ni-18);
      }
    }
  }

  .trakt-summary-details-grid-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-m);

    @include for-tablet-lg {
      grid-template-columns: 1fr;
    }

    @include for-mobile {
      grid-template-columns: 1fr;
      gap: var(--gap-xs);
    }
  }
</style>
