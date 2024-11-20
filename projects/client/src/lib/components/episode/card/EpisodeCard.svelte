<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card
  --width-card="13.25rem"
  --height-card="11rem"
  --height-card-cover="7.5rem"
>
  {@render children()}
</Card>
