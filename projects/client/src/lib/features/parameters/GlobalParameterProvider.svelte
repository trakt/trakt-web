<script lang="ts">
  import { page } from "$app/state";
  import { sanitizeGlobalParameters } from "./_internal/sanitizeGlobalParameters";
  import { useParameters } from "./useParameters";

  const { update } = useParameters();

  const { children }: ChildrenProps = $props();

  $effect(() => {
    const sanitizedParams = sanitizeGlobalParameters(page.url.searchParams);
    update(sanitizedParams);
  });
</script>

{@render children()}
