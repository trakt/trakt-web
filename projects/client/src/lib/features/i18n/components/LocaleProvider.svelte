<script lang="ts">
  import { useLocale } from "./useLocale";
  const { children }: ChildrenProps = $props();

  const locale = useLocale();
</script>

{#key $locale}
  {@render children()}
{/key}
