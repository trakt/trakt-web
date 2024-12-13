<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  --width-card="var(--width-poster-card)"
  --height-card="var(--height-poster-card)"
  --height-card-cover="var(--height-poster-card-cover)"
>
  {@render children()}
</Card>
