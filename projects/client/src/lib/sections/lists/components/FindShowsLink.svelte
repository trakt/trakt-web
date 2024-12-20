<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import Button from "$lib/components/buttons/Button.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<Button
  href={UrlBuilder.shows()}
  label={m.navbar_link_shows_label()}
  style="flat"
  variant="primary"
  size="small"
>
  {m.find_shows_link()}

  {#snippet icon()}
    <ShowIcon />
  {/snippet}
</Button>
