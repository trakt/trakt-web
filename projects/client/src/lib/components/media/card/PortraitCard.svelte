<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  variant="transparent"
  --width-card="var(--width-portrait-card)"
  --height-card="var(--height-portrait-card)"
  --height-card-cover="var(--height-portrait-card-cover)"
>
  {@render children()}
</Card>
