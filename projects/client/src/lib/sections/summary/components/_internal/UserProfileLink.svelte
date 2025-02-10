<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type UserProfileProps = {
    slug: string;
    name: string;
  };

  const { slug, name }: UserProfileProps = $props();
</script>

<Link href={UrlBuilder.og.user(slug)} target="_blank">
  <p class="secondary small ellipsis">
    {name}
  </p>
</Link>
