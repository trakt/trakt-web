<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import Button from "$lib/components/buttons/Button.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import CromulonIcon from "./cromulon/CromulonIcon.svelte";
  import type { CromulonState } from "./cromulon/CromulonState";
  import CromulonTracker from "./cromulon/CromulonTracker.svelte";

  const state = writable<CromulonState>("idle");
</script>

<div class="find-movies-link">
  <CromulonIcon state={$state} direction="right" />

  <Button
    onmousedown={() => state.set("show-me-what-you-got")}
    onmouseup={() => state.set("idle")}
    href={UrlBuilder.movies()}
    label={m.navbar_link_movies_label()}
    style="flat"
    variant="primary"
    size="small"
  >
    <CromulonTracker onObserve={state.set} />
    {m.find_movies_link()}
    {#snippet icon()}
      <MovieIcon />
    {/snippet}
  </Button>
</div>

<style>
  .find-movies-link {
    display: flex;
    align-items: end;
    justify-content: center;
    margin-top: 1rem;
  }
</style>
