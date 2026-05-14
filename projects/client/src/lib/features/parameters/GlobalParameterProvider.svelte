<script lang="ts">
  import { page } from "$app/state";
  import { sanitizeGlobalParameters } from "./_internal/sanitizeGlobalParameters";
  import { useParameters } from "./useParameters";

  const { update } = useParameters();

  const { children }: ChildrenProps = $props();

  update(sanitizeGlobalParameters(page.url.searchParams));

  $effect(() => {
    const sanitizedParams = sanitizeGlobalParameters(page.url.searchParams);
    update(sanitizedParams);
  });
</script>

{@render children()}
