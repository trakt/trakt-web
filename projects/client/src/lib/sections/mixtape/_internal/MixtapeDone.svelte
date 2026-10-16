<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import WatchlistedTag from "$lib/components/media/tags/WatchlistedTag.svelte";
  import IndicatorTags from "$lib/components/tags/IndicatorTags.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MixtapeDoneProps } from "./MixtapeDoneProps.ts";
  import MixtapePicks from "./MixtapePicks.svelte";

  const { kept, picked, closeHref, changeHref, startOverHref, onMore }: MixtapeDoneProps =
    $props();
</script>

<div class="trakt-mixtape-done">
  <div class="done-progress">
    {#each [0, 1, 2] as index (index)}
      <div class="done-segment"></div>
    {/each}
  </div>

  <header class="done-header">
    <div class="done-heading">
      <p class="bold">{m.header_mixtape_results()}</p>
      <p class="small secondary">{m.text_mixtape_done()}</p>
    </div>
    <Link href={closeHref} color="inherit" label={m.button_label_close()}>
      <span class="done-close"><CloseIcon /></span>
    </Link>
  </header>

  <div class="done-intro">
    <h2>{m.header_mixtape_done()}</h2>
    <MixtapePicks {picked} />
  </div>

  {#if kept.length > 0}
    <div class="done-kept">
      <p class="tag uppercase bold done-kicker">{m.header_mixtape_added()}</p>
      <div class="done-thumbs">
        {#each kept as { media } (media.id)}
          <div class="done-thumb">
            <div class="done-cover">
              <CrossOriginImage
                src={media.poster.url.medium}
                alt={m.image_alt_media_poster({ title: media.title })}
              />
            </div>
            <IndicatorTags>
              <WatchlistedTag />
            </IndicatorTags>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <p class="secondary">{m.text_mixtape_results_empty()}</p>
  {/if}

  <span class="done-spacer"></span>

  <div class="done-buttons">
    {#if onMore}
      <Button
        color="purple"
        label={m.button_text_mixtape_show_more()}
        onclick={onMore}
      >
        {m.button_text_mixtape_show_more()}
      </Button>
    {/if}
    <div class="done-row">
      <Button
        href={changeHref}
        variant="secondary"
        label={m.button_text_mixtape_change_picks()}
      >
        {m.button_text_mixtape_change_picks()}
      </Button>
      <Button
        href={startOverHref}
        variant="secondary"
        label={m.button_text_mixtape_start_over()}
      >
        {m.button_text_mixtape_start_over()}
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  .trakt-mixtape-done {
    position: relative;
    box-sizing: border-box;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    padding: var(--gap-s) var(--gap-m) var(--gap-l);
    padding-block-start: calc(var(--gap-s) + env(safe-area-inset-top));
    padding-block-end: calc(var(--gap-l) + env(safe-area-inset-bottom));

    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background) 40%, transparent) 0%,
      var(--color-background) 60%
    );

    p,
    h2 {
      margin: 0;
    }
  }

  .done-progress {
    display: flex;
    gap: var(--gap-xxs);
  }

  .done-segment {
    flex: 1;
    height: var(--ni-3);
    border-radius: var(--border-radius-xs);
    background: var(--color-foreground);
  }

  .done-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .done-heading {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .done-close {
    display: grid;
    place-items: center;
    width: var(--ni-44);
    height: var(--ni-44);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .done-intro {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    margin-block-start: var(--gap-l);
  }

  .done-kept {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .done-kicker {
    color: var(--color-text-emphasis);
  }

  .done-thumbs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
  }

  .done-thumb {
    --width-override-card: 100%;
  }

  .done-cover {
    aspect-ratio: 2 / 3;
    overflow: hidden;

    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .done-spacer {
    flex: 1;
  }

  .done-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    :global(.trakt-button) {
      width: 100%;
    }
  }

  .done-row {
    display: flex;
    gap: var(--gap-s);

    > :global(*) {
      flex: 1;
    }
  }
</style>
