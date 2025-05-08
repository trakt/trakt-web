<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";

  type ViewAllLinkProps = {
    href: string;
  };

  type ViewAllElementProps = HTMLElementProps;

  type ViewAllButtonProps = { label: string } & (
    | ViewAllLinkProps
    | ViewAllElementProps
  );

  const { label, ...rest }: ViewAllButtonProps = $props();
</script>

<Button {label} {...rest} style="ghost" variant="primary" color="purple">
  {m.view_all()}
</Button>
