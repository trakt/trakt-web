<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  --width-card="var(--width-thumb-card)"
  --height-card="var(--height-thumb-card)"
  --height-card-cover="var(--height-thumb-card-cover)"
>
  {@render children()}
</Card>
