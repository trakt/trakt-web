<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SyncItem } from "$lib/requests/models/SyncItem.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import StreamingServiceBadge from "./StreamingServiceBadge.svelte";
  import type { ServiceInfo } from "./toServiceInfo.ts";
  import { toStreamingWatchUrl } from "./toStreamingWatchUrl.ts";

  type SyncItemRowProps = { item: SyncItem; service?: ServiceInfo };

  const { item, service }: SyncItemRowProps = $props();

  const watchedDate = $derived(item.watchedAt ?? item.ratedAt);

  const watchUrl = $derived(
    toStreamingWatchUrl({
      serviceId: item.serviceId,
      contentId: item.contentId,
      idType: item.tmdbSeriesId ? "episode" : "movie",
    }),
  );

  const hasProgressBar = $derived(item.progress != null);

  const progressPercent = $derived(
    Math.max(0, Math.min(100, Math.round(item.progress ?? 0))),
  );

  const progressLabel = $derived.by(() => {
    if (item.progress != null) {
      return `${Math.round(item.progress)}%`;
    }
    if (item.ratingValue != null) {
      return `${item.ratingValue}`;
    }
    return undefined;
  });
</script>

<div class="trakt-sync-item-row">
  {#if service}
    <div class="service">
      {#if watchUrl}
        <Link
          href={watchUrl}
          target="_blank"
          label={m.button_label_watch_on_service({ service: service.name })}
        >
          <StreamingServiceBadge
            name={service.name}
            source={service.source}
            logoUrl={service.logoUrl}
            size="small"
          />
        </Link>
      {:else}
        <StreamingServiceBadge
          name={service.name}
          source={service.source}
          logoUrl={service.logoUrl}
          size="small"
        />
      {/if}
    </div>
  {/if}

  <div class="details">
    {#if item.traktItem?.url}
      <Link href={item.traktItem.url} color="inherit">
        <span class="title bold">{item.traktItem.label}</span>
      </Link>
    {:else if item.traktItem}
      <span class="title bold">{item.traktItem.label}</span>
    {:else}
      <span class="title bold is-bad">{m.text_unknown()}</span>
    {/if}

    <div class="meta">
      {#if watchedDate}
        <span class="meta-date capitalize">
          {toHumanDate(new Date(), watchedDate, getLocale())}
        </span>
      {/if}
      <span class="pill" class:is-bad={!item.type}>
        {item.type ?? m.text_unknown()}
      </span>
      {#if item.tmdbId != null}
        <span class="pill">
          {m.text_streaming_tmdb_pill({ id: item.tmdbId })}
        </span>
      {/if}
    </div>
  </div>

  {#if progressLabel}
    <div class="progress">
      {#if hasProgressBar}
        <div class="progress-track">
          <div class="progress-fill" style="width: {progressPercent}%"></div>
        </div>
      {/if}
      <span class="progress-value">{progressLabel}</span>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-sync-item-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--ni-12) var(--ni-16);

    transition: background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
      }
    }
  }

  .service {
    flex-shrink: 0;
  }

  .details {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .title {
    font-size: var(--font-size-text);

    color: var(--color-text-primary);

    &.is-bad {
      color: var(--color-foreground-red);
    }
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-8);
  }

  .meta-date {
    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }

  .pill {
    flex-shrink: 0;

    display: inline-block;
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-s);

    font-size: var(--font-size-tag);
    text-transform: capitalize;

    background-color: color-mix(
      in srgb,
      var(--color-text-secondary) 12%,
      transparent
    );
    color: var(--color-text-secondary);

    &.is-bad {
      background-color: var(--color-foreground-red);
      color: var(--color-background-red);
    }
  }

  .progress {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .progress-track {
    width: var(--ni-80);
    height: var(--ni-6);

    border-radius: var(--border-radius-s);
    background-color: color-mix(
      in srgb,
      var(--color-text-secondary) 20%,
      transparent
    );

    overflow: hidden;
  }

  .progress-fill {
    height: 100%;

    border-radius: inherit;
    background-color: var(--color-link-active);
  }

  .progress-value {
    min-width: var(--ni-32);

    font-size: var(--font-size-tag);
    color: var(--color-text-primary);
    text-align: right;
  }

  .trakt-sync-item-row :global(.trakt-link) {
    text-decoration: none;
  }
</style>
