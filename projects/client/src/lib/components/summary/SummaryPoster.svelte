<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Snippet } from "svelte";
  import Link from "../link/Link.svelte";

  type SummaryPosterProps = {
    src: string;
    alt: string;
    href?: string;
    actions?: Snippet;
  };

  const { src, alt, href, actions }: SummaryPosterProps = $props();
</script>

<div class="trakt-summary-poster-container">
  <div class="trakt-summary-poster">
    <Link {href}>
      <CrossOriginImage {src} {alt} />
    </Link>
  </div>

  {@render actions?.()}
</div>

<style>
  .trakt-summary-poster-container {
    width: var(--ni-320);
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
  }

  .trakt-summary-poster {
    :global(img) {
      border-radius: var(--border-radius-xxl);
      align-self: stretch;
      width: var(--ni-320);
      height: var(--ni-480);

      box-shadow: 0px 7.673px 23.02px 0px rgba(0, 0, 0, 0.56);
    }
  }
</style>
