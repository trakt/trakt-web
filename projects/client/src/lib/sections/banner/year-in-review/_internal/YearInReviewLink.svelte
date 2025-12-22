<script lang="ts">
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BannerLink from "../../_internal/BannerLink.svelte";

  const { slug, year, source }: { slug: string; year: number; source: string } =
    $props();
</script>

<BannerLink href={UrlBuilder.users(slug).yearToDate(year)} {source}>
  Check Out {year}
</BannerLink>
