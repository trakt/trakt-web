<script lang="ts">
  type SettingSectionLabelProps = {
    title: string;
    description?: string;
  };

  const { title, description }: SettingSectionLabelProps = $props();
</script>

<div class="trakt-settings-section-label">
  <span class="title bold">{title}</span>
  {#if description}
    <p class="secondary small">{description}</p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-section-label {
    max-width: var(--ni-640);
    padding: var(--gap-m) var(--gap-m) var(--gap-xs);

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    @include for-tablet-sm-and-below() {
      max-width: 100%;
    }
  }
</style>
