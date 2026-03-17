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
    margin: 0 auto;
    max-width: var(--ni-920);
    padding: var(--gap-s) var(--gap-l);
    color: var(--color-text-primary);
    line-height: 1.7;
    font-size: var(--ni-14);
  }

  .legal-header {
    margin-bottom: var(--gap-xl);

    h1 {
      font-size: var(--ni-28);
      font-weight: 700;
      margin: 0 0 var(--gap-xs);

      @include for-mobile {
        font-size: var(--ni-24);
      }
    }

    .last-updated {
      color: var(--color-text-secondary);
      font-size: var(--ni-14);
      margin: 0;
    }
  }

  .legal-summary {
    background-color: var(--color-border);
    border-radius: var(--ni-8);
    padding: var(--gap-l);
    margin: var(--gap-xl) 0;

    @include for-mobile {
      padding: var(--gap-m);
    }

    :global(h2) {
      font-size: var(--ni-20);
      font-weight: 700;
      margin: 0 0 var(--gap-s);
    }

    :global(p) {
      margin: 0 0 var(--gap-s);
    }

    :global(ul) {
      margin: 0;
      padding-left: var(--gap-l);

      :global(li) {
        margin-bottom: var(--gap-xs);
      }
    }
  }

  .legal-content {
    margin-bottom: var(--gap-l);

    :global(> p) {
      margin: 0 0 var(--gap-m);
    }

    :global(a) {
      color: var(--color-link-active);
      text-decoration: underline;

      @include for-mouse {
        &:hover,
        &:focus-visible {
          opacity: 0.8;
        }
      }
    }
  }

  // Target the sections inside the default slot
  .legal-content :global(.legal-section) {
    margin-bottom: var(--gap-xl);

    :global(h2) {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      font-size: var(--ni-18);
      font-weight: 700;
      margin: 0 0 var(--gap-m);
      padding-left: calc(var(--ni-32) + var(--gap-s));
      position: relative;

      @include for-mobile {
        font-size: var(--ni-16);
      }
    }

    :global(.number) {
      position: absolute;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--ni-32);
      height: var(--ni-32);
      border-radius: 50%;
      background-color: var(--color-border);
      font-size: var(--ni-14);
      font-weight: 600;
      flex-shrink: 0;
    }

    :global(p) {
      margin: 0 0 var(--gap-m);
    }

    :global(ol) {
      margin: 0 0 var(--gap-m);
      padding-left: var(--gap-l);

      :global(li) {
        margin-bottom: var(--gap-s);
        padding-left: var(--gap-xxs);
      }
    }
  }
</style>
