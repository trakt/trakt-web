<script lang="ts">
  type SectionListProps = {
    title: string;
  } & ChildrenProps;

  const { children, title }: SectionListProps = $props();
</script>

<section class="section-list-container">
  <h4 class="section-list-title">{title}</h4>

  <div class="section-list">
    <div class="section-list-horizontal-scroll">
      {@render children()}
    </div>
  </div>
</section>

<style>
  .section-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
  }

  .section-list-title {
    color: var(--color-text-primary);
    margin: 0;
    margin-left: calc(var(--ni-56) + var(--layout-distance-side));

    transition: calc(var(--transition-increment) * 2) ease-in-out;
    transition-property: margin-left, font-size;

    @media (max-width: 480px) {
      margin-left: var(--ni-32);
      font-size: var(--ni-24);
    }
  }

  .section-list {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: var(--ni-56);
      height: calc(
        var(--height-section-list) - var(--layout-distance-scroll-card)
      );
      /** TODO: add shadow? */
    }
  }

  .section-list-horizontal-scroll {
    padding: 0 var(--layout-distance-side);

    display: flex;
    height: var(--height-section-list);
    gap: var(--ni-16);
    overflow-x: auto;
  }
</style>
