<script lang="ts">
  import { scrollSpy } from "./scrollSpy";

  const {
    selector,
    onUpdate,
    children,
    initialId,
    skipVisible = false,
  }: {
    selector: string;
    onUpdate: (id: string) => void;
    initialId?: string;
    skipVisible?: boolean;
  } & ChildrenProps = $props();
</script>

<div
  use:scrollSpy={{ selector, onUpdate, initialId, skipVisible }}
  style="display: contents;"
>
  {@render children()}
</div>
