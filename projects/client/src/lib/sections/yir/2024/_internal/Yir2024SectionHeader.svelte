<script lang="ts">
  // Shared header pattern for 2024 section panels: a small uppercase intro
  // line above a huge headline. Reused across the stats sections (and any
  // future section that follows the same intro/title rhythm).
  const {
    intro,
    title,
  }: {
    intro: string;
    title: string;
  } = $props();
</script>

<header class="trakt-yir-2024-section-header">
  <p class="bold yir-2024-section-header-intro">{intro}</p>
  <h2 class="bold yir-2024-section-header-title">{title}</h2>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-section-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .yir-2024-section-header-intro {
    margin: 0;
    font-size: var(--ni-24);
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--shade-10);

    @include for-mobile {
      font-size: var(--ni-12);
    }
  }

  .yir-2024-section-header-title {
    margin: 0;
    font-size: clamp(var(--ni-32), 5vw, var(--ni-56));
    line-height: 1.05;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }
</style>
