<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  --width-card="var(--width-show-card)"
  --height-card="var(--height-show-card)"
  --height-card-cover="var(--height-show-card-cover)"
>
  {@render children()}
</Card>
