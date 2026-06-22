<script lang="ts">
  const {
    children,
    // tag,
    // classList = "",
    // layout = "default",
  }: {
    // tag?: Snippet;
    // classList?: string;
    // layout?: SummaryCardLayout;
  } & ChildrenProps = $props();

  // const isSmall = $derived(layout === "compact" || layout === "minimal");
</script>

<div class="trakt-summary-card-details">
  <!-- <div class="trakt-summary-card-titles"> -->
  {@render children()}
  <!-- </div> -->

  <!-- {#if tag && !isSmall}
    <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
      <div class="trakt-summary-card-tags" in:fade={{ duration: 150 }}>
        {@render tag()}
      </div>
    </RenderFor>
  {/if} -->
</div>

<style>
  .trakt-summary-card-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    flex-grow: 1;
    z-index: var(--layer-raised);

    overflow: hidden;

    padding: var(--ni-12);
    padding-top: var(--ni-10);

    /* .trakt-summary-card-titles {
      display: flex;
      flex-direction: column;
      gap: var(--gap-micro);
    } */
  }

  /* .trakt-summary-card-tags {
    :global(.trakt-tag-bar) {
      display: grid;
      grid-template-columns: 1fr 1fr;

      :global(:not(:last-child))::after {
        display: none;
      }
    }
  } */
</style>
