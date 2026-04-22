<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import type { ConfirmationParams } from "$lib/features/confirmation/models/ConfirmationParams.ts";
  import type { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import { preventUnload } from "$lib/utils/actions/preventUnload.ts";
  import type { Snippet } from "svelte";

  type Props<T extends ConfirmationType> = {
    isActive: boolean;
    confirmationParams: ConfirmationParams<T>;
    onreset: () => void;
    children: Snippet;
  };

  const {
    isActive,
    confirmationParams,
    onreset,
    children,
  }: Props<ConfirmationType> = $props();

  const { confirm } = useConfirm();

  beforeNavigate((nav) => {
    if (!isActive) return;
    if (nav.willUnload) return;

    nav.cancel();

    confirm({
      ...confirmationParams,
      onConfirm: () => {
        onreset();
        if (nav.to) {
          // eslint-disable-next-line svelte/no-navigation-without-resolve
          goto(nav.to.url);
        }
      },
    })();
  });
</script>

<div class="navigation-guard" use:preventUnload={isActive}>
  {@render children()}
</div>

<style>
  .navigation-guard {
    display: contents;
  }
</style>
