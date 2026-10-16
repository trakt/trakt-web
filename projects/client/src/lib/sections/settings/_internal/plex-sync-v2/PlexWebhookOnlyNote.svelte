<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<div class="trakt-plex-webhook-only-note">
  <p class="secondary small">{m.description_media_sync_webhook_only_intro()}</p>
  <ul>
    <li>
      <span class="note-icon" aria-hidden="true"><PlayIcon size="small" /></span>
      <p class="small">{m.description_media_sync_webhook_only_progress()}</p>
    </li>
    <li>
      <span class="note-icon" aria-hidden="true"><CheckIcon /></span>
      <p class="small">{m.description_media_sync_webhook_only_watches()}</p>
    </li>
    <li>
      <span class="note-icon" aria-hidden="true"><StarIcon fill="none" /></span>
      <p class="small">{m.description_media_sync_webhook_only_ratings()}</p>
    </li>
  </ul>
</div>

<style lang="scss">
  .trakt-plex-webhook-only-note {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-16);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);

    p,
    ul {
      margin: 0;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
    }
  }

  .note-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;

    width: var(--ni-28);
    height: var(--ni-28);
    border-radius: var(--border-radius-s);

    background: color-mix(in srgb, var(--purple-500) 18%, transparent);
    color: var(--purple-300);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }
</style>
