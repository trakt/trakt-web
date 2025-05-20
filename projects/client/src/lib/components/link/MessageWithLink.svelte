<script lang="ts">
  import Link from "./Link.svelte";

  const { message, href, target } = $props();

  const [beforeText, linkText, afterText] = message.split(/<a[^>]*>|<\/a>/);
</script>

{beforeText}<Link {href} {target}>{linkText}</Link>{afterText}
