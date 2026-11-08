<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";

  const {
    href,
    src,
    title,
    alt,
  }: { href: string; src: string; title: string; alt: string } = $props();
</script>

<Link focusable={false} {href}>
  <CardCover {title} {src} {alt} />
</Link>
