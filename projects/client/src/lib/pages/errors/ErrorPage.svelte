<script lang="ts">
  type PageErrorPropsWithMessage = {
    title: string;
    message: string;
    children?: never;
  };

  type PageErrorPropsWithChildren = {
    title: string;
    message?: never;
  } & ChildrenProps;

  type PageErrorProps = PageErrorPropsWithMessage | PageErrorPropsWithChildren;

  const { title, ...rest }: PageErrorProps = $props();
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="error-page">
  <h1>{title}</h1>
  {#if rest.children}
    {@render rest.children()}
  {:else}
    <p>{rest.message}</p>
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
    box-sizing: border-box;

    h1 {
      transition: var(--transition-increment) ease-in-out;
      transition-property: font-size;
    }

    @include for-tablet-sm-and-below {
      h1 {
        font-size: var(--ni-48);
      }
    }

    @include for-mobile {
      h1 {
        font-size: var(--ni-24);
      }
    }
  }
</style>
