<script lang="ts">
  export let title: string;
  export let lastUpdated: string;
</script>

<div class="legal-page">
  <header class="legal-header">
    <h1>{title}</h1>
    <p class="last-updated">
      Last Updated &mdash; <strong>{lastUpdated}</strong>
    </p>
  </header>

  <div class="legal-content">
    <slot name="intro" />
  </div>

  <div class="legal-summary">
    <slot name="summary" />
  </div>

  <div class="legal-content">
    <slot />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .legal-page {
    --width-max-page: var(--ni-920);
    --number-width: var(--ni-32);

    margin: 0 auto;
    max-width: var(--width-max-page);
    padding: var(--gap-s) var(--gap-l);
    color: var(--color-text-primary);
    line-height: 1.7;
    font-size: var(--font-size-text);

    :global(h2) {
      margin: 0 0 var(--gap-s);
    }

    :global(p) {
      margin: 0 0 var(--gap-m);
    }

    :global(ul),
    :global(ol) {
      margin: 0 0 var(--gap-m);
      padding-left: var(--gap-l);

      :global(li) {
        margin-bottom: var(--gap-xs);
      }
    }
  }

  .legal-header {
    margin-bottom: var(--gap-xl);

    h1 {
      margin: 0 0 var(--gap-xs);
    }

    .last-updated {
      color: var(--color-text-secondary);
      font-size: var(--font-size-text);
      margin: 0;
    }
  }

  .legal-summary {
    background-color: var(--color-card-background);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-base);
    border-radius: var(--border-radius-s);
    padding: var(--gap-l);
    margin: var(--gap-xl) 0;

    @include for-mobile {
      padding: var(--gap-m);
    }
  }

  .legal-content {
    margin-bottom: var(--gap-l);

    // Target the sections inside the default slot
    :global(.legal-section) {
      margin-bottom: var(--gap-xl);

      :global(h2) {
        display: flex;
        align-items: center;
        gap: var(--gap-s);
        margin: 0 0 var(--gap-m);
        padding-left: calc(var(--number-width) + var(--gap-s));
        position: relative;
      }

      :global(.number) {
        position: absolute;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--number-width);
        height: var(--number-width);
        border-radius: 50%;
        background-color: var(--color-card-background);
        border: 1px solid var(--color-border);
        font-size: var(--font-size-text);
        font-weight: 600;
        flex-shrink: 0;
      }
    }
  }
</style>
