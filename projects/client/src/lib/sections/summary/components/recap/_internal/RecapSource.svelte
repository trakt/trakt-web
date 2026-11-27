<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { attribution }: { attribution: HttpsUrl } = $props();
</script>

<p class="trakt-recap-source tag secondary">
  <Link
    href={attribution}
    target="_blank"
    rel="noopener noreferrer"
    color="inherit"
    underline="hover"
  >
    {m.text_recap_source_adapted_wikipedia()}
  </Link>
  <span aria-hidden="true">·</span>
  <Link
    href={UrlBuilder.external.ccBySa4()}
    target="_blank"
    rel="noopener noreferrer"
    color="inherit"
    underline="hover"
  >
    {m.text_recap_source_license()}
  </Link>
</p>

<style lang="scss">
  .trakt-recap-source {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xxs);

    margin: 0;
    margin-top: var(--gap-s);

    color: var(--color-text-secondary);
    opacity: 0.8;
  }
</style>
