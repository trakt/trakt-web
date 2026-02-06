<script lang="ts">
  import { scrollSpy } from "./scrollSpy";

  const {
    selector,
    onUpdate,
    children,
    initialId,
  }: {
    selector: string;
    onUpdate: (id: string) => void;
    initialId?: string;
  } & ChildrenProps = $props();
</script>

<div
  use:scrollSpy={{ selector, onUpdate, initialId }}
  style="display: contents;"
>
  {@render children()}
</div>
