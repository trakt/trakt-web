<script lang="ts">
  const { message }: { message: string } = $props();

  const segments = $derived(
    message.split(/(<b>.*?<\/b>)/g).map((seg) => ({
      text: seg.replace(/<\/?b>/g, ""),
      bold: seg.startsWith("<b>"),
    })),
  );
</script>

{#each segments as { text, bold }}
  {#if bold}<b>{text}</b>{:else}{text}{/if}
{/each}
