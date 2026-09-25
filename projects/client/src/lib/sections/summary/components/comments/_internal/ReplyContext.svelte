<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { href }: { href: string } = $props();
</script>

<p class="trakt-reply-context small secondary">
  <span>{m.text_your_reply()}</span>
  <Link {href} label={m.link_label_view_thread()}>
    {m.link_text_view_thread()}
  </Link>
</p>

<style>
  .trakt-reply-context {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
    margin: 0;
  }
</style>
