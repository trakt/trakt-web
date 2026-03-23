<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import * as m from "$lib/features/i18n/messages";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
</script>

<Popover>
  <ActionButton
    label={m.button_label_create_list()}
    color="default"
    variant="primary"
    style="ghost"
  >
    <PlusIcon />
  </ActionButton>

  {#snippet content()}
    <UpsellCta source="lists">
      {m.link_text_vip_list_upsell()}
    </UpsellCta>
  {/snippet}
</Popover>
