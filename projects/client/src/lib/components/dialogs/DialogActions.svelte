<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { DialogAction } from "./DialogAction.ts";

  type DialogActionsProps = {
    secondary: DialogAction;
    primary: DialogAction & {
      color: "purple" | "red";
      isAutofocused?: boolean;
    };
  };

  const { secondary, primary }: DialogActionsProps = $props();
</script>

<Button
  style="ghost"
  size="small"
  color="default"
  label={secondary.label}
  disabled={secondary.disabled}
  onclick={secondary.onclick}
>
  {secondary.label}
</Button>
<Button
  size="small"
  color={primary.color}
  label={primary.label}
  disabled={primary.disabled}
  onclick={primary.onclick}
  data-autofocus={primary.isAutofocused || undefined}
>
  {primary.label}
</Button>
