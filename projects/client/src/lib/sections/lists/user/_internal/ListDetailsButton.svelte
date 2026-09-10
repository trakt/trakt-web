<script lang="ts">
  import { page } from "$app/state";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import {
    UserListDrawers,
    userListDrawerNavigation,
  } from "./userListDrawerNavigation.ts";

  const { list }: { list: MediaListSummary } = $props();

  const { buildDrawerLink } = $derived(
    userListDrawerNavigation(page.url.searchParams),
  );
</script>

<DropdownItem
  label={m.button_label_details({ title: list.name })}
  style="flat"
  color="default"
  variant="secondary"
  {...buildDrawerLink(UserListDrawers.Details)}
>
  {m.button_text_details()}

  {#snippet icon()}
    <InfoIcon />
  {/snippet}
</DropdownItem>
