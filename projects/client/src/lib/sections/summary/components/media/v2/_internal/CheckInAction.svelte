<script lang="ts">
  import CheckInIcon from "$lib/components/icons/CheckInIcon.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { useCheckIn } from "$lib/sections/media-actions/check-in/useCheckIn";
  import MediaAction from "./MediaAction.svelte";

  const { media }: { media: MediaEntry } = $props();

  const { isCheckingIn, isCheckedIn, checkin, isWatchable } = $derived(
    useCheckIn({ media, type: "movie" }),
  );

  const disabled = $derived($isCheckingIn || $isCheckedIn || !isWatchable);
</script>

<MediaAction text="Check-in" label="TODO" onclick={checkin} {disabled}>
  <CheckInIcon />
</MediaAction>
