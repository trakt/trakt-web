<script lang="ts">
  const { title }: { title: string } = $props();
</script>

<p class="settings-section-label bold">{title}</p>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .settings-section-label {
    max-width: var(--ni-640);
    padding: var(--gap-m) var(--gap-m) var(--gap-xs);
    font-size: var(--font-size-title);

    @include for-tablet-sm-and-below() {
      max-width: 100%;
    }
  }
</style>
