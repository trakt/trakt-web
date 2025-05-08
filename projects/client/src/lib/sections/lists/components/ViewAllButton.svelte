<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";

  type ViewAllLinkProps = HTMLAnchorProps & HTMLElementProps;

  type ViewAllElementProps = HTMLElementProps;

  type ViewAllButtonProps = { label: string } & (
    | ViewAllElementProps
    | ViewAllLinkProps
  );

  const { label, ...rest }: ViewAllButtonProps = $props();
</script>

<Button {label} {...rest} style="ghost" variant="primary" color="purple">
  {m.view_all()}
</Button>
