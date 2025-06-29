<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { size }: { size: "small" | "tag" } = $props();
</script>

<Button
  {size}
  href={UrlBuilder.settings()}
  label={m.button_label_settings()}
  color="default"
  style="flat"
  variant="secondary"
>
  {m.button_text_settings()}
</Button>
