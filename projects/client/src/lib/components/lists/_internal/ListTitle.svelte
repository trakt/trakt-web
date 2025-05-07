<script lang="ts">
  const { title, style }: { title: string; style: "primary" | "secondary" } =
    $props();
</script>

<h4 class="shadow-list-title ellipsis" data-style={style}>{title}</h4>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .shadow-list-title {
    transition: font-size calc(var(--transition-increment) * 2) ease-in-out;

    @include for-tablet-sm {
      font-size: var(--ni-32);
    }

    @include for-mobile {
      font-size: var(--ni-24);
    }

    &[data-style="primary"] {
      color: var(--color-text-primary);
    }

    &[data-style="secondary"] {
      color: var(--color-text-secondary);
    }
  }
</style>
