<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card --width-card="9.8rem" --height-card="18rem" --height-card-cover="15.5rem">
  {@render children()}
</Card>
