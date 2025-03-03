<script lang="ts">
  import FirebaseSetup from "./FirebaseSetup.svelte";

  const { children }: ChildrenProps = $props();
</script>

<FirebaseSetup>
  {@render children()}
</FirebaseSetup>
