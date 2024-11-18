<script lang="ts">
  type SectionListProps = {
    title: string;
  } & ChildrenProps;

  const { children, title }: SectionListProps = $props();
</script>

<section class="section-list-container">
  <h2 class="section-list-title">{title}</h2>

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
    gap: 2rem;
  }

  .section-list-title {
    color: var(--color-text-primary);
    margin: 0;
    margin-left: calc(3.5rem + var(--layout-distance-side));
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 600;
    line-height: 90%;
    letter-spacing: -0.1rem;

    transition: calc(var(--transition-increment) * 2) ease-in-out;
    transition-property: margin-left, font-size;

    @media (max-width: 480px) {
      margin-left: 2rem;
      font-size: 1.5rem;
    }
  }

  .section-list {
    position: relative;

    &&::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 3.5rem;
      height: 11rem;

      /** TODO: add shadow? */
    }
  }

  .section-list-horizontal-scroll {
    padding: 0 var(--layout-distance-side);

    display: flex;
    height: var(--height-section-list);
    gap: 1rem;
    overflow-x: auto;
  }
</style>
