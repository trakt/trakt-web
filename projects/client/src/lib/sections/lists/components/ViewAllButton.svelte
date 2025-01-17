<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";

  type ViewAllButtonProps = {
    href: string;
    label: string;
  };

  const { href, label }: ViewAllButtonProps = $props();
</script>

<Button
  {label}
  {href}
  style="flat"
  variant="primary"
  color="purple"
  size="small"
>
  {m.view_all()}
</Button>
