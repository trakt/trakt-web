<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { writable } from "$lib/utils/store/WritableSubject";
  import MediaActionsPopupButton from "./MediaActionsPopupButton.svelte";
  import SummaryActionsDrawer from "./SummaryActionsDrawer.svelte";
  import SummaryActionsSlider from "./SummaryActionsSlider.svelte";

  const {
    children,
    title,
    metaInfo,
    transitionDuration,
  }: ChildrenProps & {
    title: string;
    metaInfo?: string;
    transitionDuration: number;
  } = $props();

  const isOpen = writable(false);

  const commonProps = $derived({
    isOpen: $isOpen,
    onOpenChange: (value: boolean) => isOpen.set(value),
  });
</script>

<MediaActionsPopupButton
  {title}
  isOpen={$isOpen}
  onToggle={() => requestAnimationFrame(() => isOpen.set(!$isOpen))}
/>

<RenderFor audience="all" device={["tablet-sm", "mobile"]}>
  <SummaryActionsDrawer {title} {metaInfo} {...commonProps}>
    {@render children()}
  </SummaryActionsDrawer>
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <SummaryActionsSlider {transitionDuration} {...commonProps}>
    {@render children()}
  </SummaryActionsSlider>
</RenderFor>
