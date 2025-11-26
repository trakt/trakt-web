<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Snippet } from "svelte";

  const {
    children,
    header,
    footer,
    coverSrc,
    variant = "default",
  }: {
    coverSrc: HttpsUrl;
    header: Snippet;
    footer: Snippet;
    variant?: "default" | "gradient";
  } & ChildrenProps = $props();
</script>

<div class="trakt-review-content" data-variant={variant}>
  <div class="trakt-review-content-cover-image">
    <CrossOriginImage
      loading="eager"
      src={coverSrc}
      animate={false}
      alt="Background image"
    />
  </div>

  <div class="trakt-review-content-header">
    {@render header()}
  </div>

  {@render children()}

  <div class="trakt-review-content-footer">
    {@render footer()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-review-content {
    --review-content-height: var(--ni-148);
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-m);

    height: var(--review-content-height);

    padding: var(--ni-14);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);

    color: var(--shade-10);
    background: var(--shade-900);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background, height, padding, gap;

    filter: drop-shadow(
        var(--ni-0) var(--ni-88) var(--ni-36)
          color-mix(in srgb, var(--color-shadow) 2%, transparent)
      )
      drop-shadow(
        var(--ni-0) var(--ni-52) var(--ni-32)
          color-mix(in srgb, var(--color-shadow) 6%, transparent)
      )
      drop-shadow(
        var(--ni-0) var(--ni-24) var(--ni-24)
          color-mix(in srgb, var(--color-shadow) 10%, transparent)
      )
      drop-shadow(
        var(--ni-0) var(--ni-8) var(--ni-12)
          color-mix(in srgb, var(--color-shadow) 12%, transparent)
      );
  }

  .trakt-review-content[data-variant="gradient"] {
    background: radial-gradient(
      60.59% 305.37% at 100% 100%,
      var(--purple-500) 0%,
      var(--shade-900) 100%
    );
  }

  .trakt-review-content-cover-image {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;
    border-radius: var(--border-radius-l);
    z-index: var(--layer-background);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0.2;
    }
  }

  .trakt-review-content-header,
  .trakt-review-content-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
  }

  .trakt-review-content-header,
  .trakt-review-content-footer {
    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
