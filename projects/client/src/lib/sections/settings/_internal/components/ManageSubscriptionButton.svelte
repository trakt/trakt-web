<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<Button
  href={UrlBuilder.vip()}
  label={m.button_label_manage_subscription()}
  color="purple"
  size="small"
  variant="secondary"
  target="_blank"
>
  {m.button_text_manage_subscription()}
  {#snippet icon()}
    <VipIcon />
  {/snippet}
</Button>
