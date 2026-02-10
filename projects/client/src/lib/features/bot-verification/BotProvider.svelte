<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { setBotContext } from "./stores/useBotContext";

  const {
    children,
    isLegitimateBot,
  }: ChildrenProps & { isLegitimateBot: boolean } = $props();

  iffy(() => setBotContext(isLegitimateBot));
</script>

{@render children()}
