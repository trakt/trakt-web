<script lang="ts">
  const { title }: { title: string } = $props();
</script>

<h4 class="shadow-list-title ellipsis">{title}</h4>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .shadow-list-title {
    color: var(--color-text-primary);
    transition: font-size calc(var(--transition-increment) * 2) ease-in-out;

    @include for-tablet-sm {
      font-size: var(--ni-32);
    }

    @include for-mobile {
      font-size: var(--ni-24);
    }
  }
</style>
