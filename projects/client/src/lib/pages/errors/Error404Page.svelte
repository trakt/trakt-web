<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MissingReelMark from "./_internal/MissingReelMark.svelte";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage
  title={m.page_title_error_404()}
  kicker={m.error_kicker_404()}
  message={m.error_text_404()}
  {mark}
  {actions}
/>

{#snippet mark()}
  <MissingReelMark />
{/snippet}

{#snippet actions()}
  <Button
    variant="primary"
    color="purple"
    style="outline"
    shape="pill"
    href={UrlBuilder.home()}
    label={m.link_text_back_to_safety()}
  >
    {m.link_text_back_to_safety()}
  </Button>
{/snippet}
