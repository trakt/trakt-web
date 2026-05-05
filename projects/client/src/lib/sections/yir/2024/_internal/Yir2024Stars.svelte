<script lang="ts">
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
</script>

<span class="yir-2024-stars" aria-hidden="true">
  <StarIcon fill="none" />
  <StarIcon fill="none" />
  <StarIcon fill="none" />
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-stars {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    color: var(--purple-300);

    :global(svg) {
      width: var(--ni-28);
      height: var(--ni-28);
    }

    @include for-mobile {
      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }
  }
</style>
