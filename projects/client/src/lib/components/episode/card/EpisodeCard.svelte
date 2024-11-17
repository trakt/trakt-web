<script lang="ts">
  import Card from "../../card/Card.svelte";

  const { children }: ChildrenProps = $props();
</script>

<Card --card-width="12.5rem" --card-height="11rem">
  {@render children()}
</Card>
