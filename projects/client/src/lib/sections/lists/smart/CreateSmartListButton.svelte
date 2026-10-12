<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<ActionButton
  label={m.button_label_create_list()}
  color="default"
  variant="primary"
  style="ghost"
  href={UrlBuilder.lists.smart.create()}
>
  <PlusIcon />
</ActionButton>
