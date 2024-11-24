<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  --width-card="var(--width-episode-card)"
  --height-card="var(--height-episode-card)"
  --height-card-cover="var(--height-episode-card-cover)"
>
  {@render children()}
</Card>
