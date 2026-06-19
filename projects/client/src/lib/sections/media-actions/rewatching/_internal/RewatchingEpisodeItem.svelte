<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CheckInIcon from "$lib/components/icons/CheckInIcon.svelte";
  import IconWrapper from "$lib/components/icons/IconWrapper.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import { useCheckIn } from "../../check-in/useCheckIn";
  import { useMarkAsWatched } from "../../mark-as-watched/useMarkAsWatched";
  import { useRewatching } from "../useRewatching";

  type RewatchingEpisodeAction = "watched" | "checkin";

  type RewatchingEpisodeItemProps = {
    show: ShowEntry;
    episode: EpisodeEntry;
    onAction: () => void;
    onPendingChange: (isPending: boolean) => void;
  };

  const {
    show,
    episode,
    onAction,
    onPendingChange,
  }: RewatchingEpisodeItemProps = $props();

  let activeAction = $state<RewatchingEpisodeAction | null>(null);

  const target = $derived({
    type: "episode" as const,
    media: episode,
    show,
  });

  const { startRewatching, isUpdatingRewatching } = $derived(
    useRewatching({ show }),
  );
  const { markAsWatched, isMarkingAsWatched, isWatchable: isMarkWatchable } =
    $derived(
      useMarkAsWatched(target),
    );
  const { checkin, isCheckingIn, isCheckedIn, isWatchable: isCheckinWatchable } =
    $derived(
      useCheckIn(target),
    );
  const { confirm } = useConfirm();

  const src = $derived(
    useEpisodeSpoilerImage({ episode, show, variant: "default" }),
  );

  const isBusy = $derived(
    $isUpdatingRewatching || $isMarkingAsWatched || $isCheckingIn ||
      activeAction != null,
  );
  const isCheckinDisabled = $derived(
    isBusy || !isCheckinWatchable || $isCheckedIn,
  );
  const isWatchedDisabled = $derived(isBusy || !isMarkWatchable);

  const runRewatchingAction = async (
    action: RewatchingEpisodeAction,
    handler: () => Promise<unknown>,
  ) => {
    activeAction = action;
    onPendingChange(true);

    try {
      const didStart = await startRewatching();
      if (!didStart) return;

      await handler();
      onAction();
    } finally {
      activeAction = null;
      onPendingChange(false);
    }
  };

  const markAsWatchedNow = () =>
    runRewatchingAction("watched", () => markAsWatched("now"));

  const checkinNow = () => runRewatchingAction("checkin", checkin);

  const selectCheckin = () => {
    if (isCheckinDisabled) return;
    checkinNow();
  };

  const selectWatched = () => {
    if (isWatchedDisabled) return;
    confirmMarkAsWatched();
  };

  const confirmMarkAsWatched = $derived(
    confirm({
      type: ConfirmationType.MarkAsWatched,
      title: episode.title,
      target,
      onConfirm: markAsWatchedNow,
    }),
  );
</script>

{#snippet checkinIcon()}
  <IconWrapper isLoading={activeAction === "checkin"}>
    <CheckInIcon />
  </IconWrapper>
{/snippet}

{#snippet watchedIcon()}
  <IconWrapper isLoading={activeAction === "watched"}>
    <TrackIcon state="unwatched" />
  </IconWrapper>
{/snippet}

{#snippet popupActions()}
  <DropdownItem
    onclick={selectCheckin}
    label={m.button_label_checkin({ title: episode.title })}
    style="flat"
    color="default"
    disabled={isCheckinDisabled}
    variant="primary"
  >
    {m.button_text_checkin()}
    {#snippet icon()}
      {@render checkinIcon()}
    {/snippet}
  </DropdownItem>

  <DropdownItem
    onclick={selectWatched}
    label={m.button_label_mark_as_watched_now()}
    style="flat"
    color="default"
    disabled={isWatchedDisabled}
    variant="primary"
  >
    {m.button_text_mark_as_watched_now()}
    {#snippet icon()}
      {@render watchedIcon()}
    {/snippet}
  </DropdownItem>
{/snippet}

{#snippet action()}
  <ActionButton
    onclick={confirmMarkAsWatched}
    label={m.button_label_mark_as_watched({ title: episode.title })}
    color="purple"
    variant="secondary"
    style="ghost"
    disabled={isBusy || !isMarkWatchable}
  >
    {@render watchedIcon()}
  </ActionButton>
{/snippet}

<EpisodeItem
  {episode}
  media={show}
  variant="default"
  style="minimal"
  context="show"
  source="rewatching-drawer"
  coverUrl={$src}
  {popupActions}
  {action}
/>
