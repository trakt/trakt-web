<script lang="ts">
  import Link from "./Link.svelte";

  const { message, href, target, color }: {
    message: string;
    href: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    color?: "default" | "classic" | "inherit";
  } = $props();

  const [beforeText, linkText, afterText] = $derived(
    message.split(/<a[^>]*>|<\/a>/),
  );
</script>

{beforeText}<Link {href} {target} {color}>{linkText}</Link>{afterText}
