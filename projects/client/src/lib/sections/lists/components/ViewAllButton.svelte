<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";

  type ViewAllButtonProps = {
    href: string;
    label: string;
    isDisabled: boolean;
  };

  const { href, label, isDisabled }: ViewAllButtonProps = $props();
</script>

<Button
  {label}
  {href}
  disabled={isDisabled || undefined}
  style="flat"
  variant="primary"
  color="purple"
  size="small"
>
  {m.view_all()}
</Button>
