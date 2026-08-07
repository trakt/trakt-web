<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { dummyReactionGifs } from "../dummyReactionGifs.ts";

  type ComposerSubmission = {
    body: string;
    gifUrl: string | null;
  };

  const { onSubmit, disabled = false }: {
    onSubmit: (submission: ComposerSubmission) => void;
    // Gated until a mood is picked - a post is always tied to a reaction.
    disabled?: boolean;
  } = $props();

  let body = $state("");
  let gifUrl = $state<string | null>(null);

  const canSubmit = $derived(body.trim().length > 0 && !disabled);

  function submit() {
    if (!canSubmit) {
      return;
    }

    onSubmit({ body: body.trim(), gifUrl });
    body = "";
    gifUrl = null;
  }

  function toggleGif() {
    if (disabled) {
      return;
    }

    // V0 attaches a random self-contained dummy GIF to stand in for the
    // eventual GIF picker so the layout can be exercised end to end.
    if (gifUrl != null) {
      gifUrl = null;
      return;
    }

    const index = Math.floor(Math.random() * dummyReactionGifs.length);
    gifUrl = dummyReactionGifs.at(index) ?? null;
  }
</script>

<form
  class="trakt-forum-composer"
  class:is-disabled={disabled}
  onsubmit={(event) => {
    event.preventDefault();
    submit();
  }}
>
  <textarea
    class="composer-input"
    bind:value={body}
    rows="2"
    {disabled}
    placeholder={m.reaction_forum_composer_placeholder()}
    aria-label={m.reaction_forum_composer_placeholder()}
  ></textarea>

  {#if gifUrl}
    <div class="composer-gif-preview">
      <img src={gifUrl} alt={m.reaction_forum_gif_alt()} loading="lazy" />
    </div>
  {/if}

  <div class="composer-actions">
    <button
      type="button"
      class="composer-gif-toggle"
      class:is-active={gifUrl != null}
      {disabled}
      onclick={toggleGif}
    >
      {gifUrl == null
        ? m.reaction_forum_composer_add_gif()
        : m.reaction_forum_composer_remove_gif()}
    </button>

    <button type="submit" class="composer-submit" disabled={!canSubmit}>
      {m.reaction_forum_composer_submit()}
    </button>
  </div>
</form>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-forum-composer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--gap-s);

    border: var(--border-thickness-xxs) solid var(--color-card-border);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);

    // Waiting for a mood to be picked before it can be used.
    &.is-disabled {
      opacity: 0.55;
    }

    .composer-input {
      width: 100%;
      box-sizing: border-box;
      resize: vertical;

      padding: var(--ni-8) var(--ni-10);

      border: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 12%, transparent);
      border-radius: var(--border-radius-m);
      background: var(--color-page-background);
      color: var(--color-text-primary);

      font-family: inherit;
      font-size: var(--font-size-text);
      line-height: 1.4;

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--purple-500);
        outline-offset: var(--border-thickness-xs);
      }
    }

    .composer-gif-preview {
      overflow: hidden;
      border-radius: var(--border-radius-m);

      img {
        display: block;
        width: 100%;
        max-height: var(--ni-180);
        object-fit: cover;
      }
    }

    .composer-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);
    }

    .composer-gif-toggle,
    .composer-submit {
      padding-block: var(--ni-6);
      padding-inline: var(--ni-12);

      border-radius: var(--border-radius-m);

      font-size: var(--font-size-text);
      cursor: pointer;

      &:disabled {
        cursor: not-allowed;
      }
    }

    .composer-gif-toggle {
      border: var(--border-thickness-xxs) solid var(--color-card-border);
      background: transparent;
      color: var(--color-text-secondary);

      &.is-active {
        border-color: var(--purple-500);
        color: var(--purple-500);
      }
    }

    .composer-submit {
      border: none;
      background: var(--color-foreground-button);
      color: var(--color-background-button);
      font-weight: 600;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
</style>
