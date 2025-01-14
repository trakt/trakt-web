<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  --width-card="var(--width-person-card)"
  --height-card="var(--height-person-card)"
  --height-card-cover="var(--height-person-card-cover)"
>
  {@render children()}
</Card>
