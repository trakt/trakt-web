<script lang="ts">
  type PageErrorProps = {
    title: string;
    message: string;
  } & Partial<ChildrenProps>;

  const { title, message, children }: PageErrorProps = $props();
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="error-page">
  <h1>{title}</h1>
  <p>{message}</p>
  {#if children != null}
    {@render children()}
  {/if}
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .error-page {
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-l);

    text-align: center;

    padding: var(--layout-distance-side);

    h1 {
      transition: var(--transition-increment) ease-in-out;
      transition-property: font-size, letter-spacing;
    }

    @include for-tablet-sm-and-below {
      h1 {
        font-size: var(--ni-48);
      }
    }

    @include for-mobile {
      h1 {
        font-size: var(--ni-24);
        letter-spacing: 0;
      }
    }
  }
</style>
