<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  variant="transparent"
  --width-card="var(--width-landscape-card)"
  --height-card="var(--height-landscape-card)"
  --height-card-cover="var(--height-landscape-card-cover)"
>
  {@render children()}
</Card>
