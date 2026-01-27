<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import WatchAgainAction from "../../../_internal/WatchAgainAction.svelte";
  import SideActions from "./SideActions.svelte";

  const { media, title }: { media: MediaEntry; title: string } = $props();
</script>

<WatchAgainAction type={media.type} {media} {title} />

<SideActions
  {title}
  style="dropdown-item"
  variant="primary"
  type={media.type}
/>

<SetCoverImageAction
  style="dropdown-item"
  type={media.type}
  id={media.id}
  variant="primary"
  {title}
/>
