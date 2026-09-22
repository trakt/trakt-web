<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { Library } from "../models/Library.ts";

  const { library }: { library: Library } = $props();
</script>

{#if library === "plex"}
  <div class="trakt-library-empty-state">
    <p>{m.text_empty_plex_library()}</p>
    <Button
      href={UrlBuilder.settings.plex()}
      label={m.button_connect_plex()}
      size="small"
      style="outline"
    >
      {m.button_connect_plex()}
    </Button>
  </div>
{:else}
  {m.list_placeholder_personal_list_empty()}
{/if}

<style lang="scss">
  .trakt-library-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
