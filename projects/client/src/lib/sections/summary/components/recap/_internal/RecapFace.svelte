<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toInitials } from "$lib/utils/string/toInitials.ts";

  const {
    name,
    headshot,
    size = "normal",
  }: {
    name: string;
    headshot: HttpsUrl | null;
    size?: "normal" | "small";
  } = $props();
</script>

<span class="trakt-recap-face" data-size={size}>
  {#if headshot}
    <CrossOriginImage src={headshot} alt="" />
  {:else}
    <span class="bold face-initials" aria-hidden="true">{toInitials(name)}</span>
  {/if}
</span>

<style lang="scss">
  .trakt-recap-face {
    --recap-face-size: var(--ni-44);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--recap-face-size);
    height: var(--recap-face-size);

    overflow: hidden;
    border-radius: 50%;
    box-shadow: 0 0 0 var(--border-thickness-xs)
      var(
        --recap-face-ring,
        color-mix(in srgb, var(--color-text-primary) 8%, transparent)
      );
    background-color: color-mix(
      in srgb,
      var(--color-text-primary) 10%,
      transparent
    );

    &[data-size="small"] {
      --recap-face-size: var(--ni-40);

      box-shadow: 0 0 0 var(--border-thickness-xs)
        var(--color-card-background);
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 20%;
    }

    .face-initials {
      font-size: var(--font-size-text-small);
      color: var(--color-text-emphasis);
    }

    &:has(.face-initials) {
      background-color: color-mix(in srgb, var(--purple-500) 22%, transparent);
    }
  }
</style>
