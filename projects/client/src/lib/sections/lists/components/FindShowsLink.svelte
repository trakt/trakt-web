<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import Button from "$lib/components/buttons/Button.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import CromulonIcon from "./cromulon/CromulonIcon.svelte";
  import type { CromulonState } from "./cromulon/CromulonState";
  import CromulonTracker from "./cromulon/CromulonTracker.svelte";

  const state = writable<CromulonState>("idle");
</script>

<div class="find-shows-link">
  <Button
    href={UrlBuilder.shows()}
    label={m.button_label_browse_shows()}
    style="flat"
    variant="primary"
    color="purple"
    size="small"
  >
    {m.button_text_find_shows()}
    {#snippet icon()}
      <ShowIcon />
    {/snippet}
  </Button>
  <RenderFor audience="authenticated" input={["mouse"]}>
    <CromulonIcon state={$state} direction="left" />
    <CromulonTracker onObserve={state.set} />
  </RenderFor>
</div>

<style>
  .find-shows-link {
    display: flex;
    align-items: end;
    justify-content: center;
  }
</style>
