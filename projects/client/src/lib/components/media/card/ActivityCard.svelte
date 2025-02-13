<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  --width-card="var(--width-activity-card)"
  --height-card="var(--height-activity-card)"
  --height-card-cover="var(--height-activity-card-cover)"
>
  {@render children()}
</Card>
