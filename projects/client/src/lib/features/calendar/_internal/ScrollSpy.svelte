<script lang="ts">
  import { scrollSpy } from "./scrollSpy";

  const {
    selector,
    onUpdate,
    children,
  }: {
    selector: string;
    onUpdate: (id: string) => void;
  } & ChildrenProps = $props();
</script>

<div use:scrollSpy={{ selector, onUpdate }} style="display: contents;">
  {@render children()}
</div>
