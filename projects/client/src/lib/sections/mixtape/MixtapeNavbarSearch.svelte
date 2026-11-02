<script lang="ts">
  import { page } from "$app/state";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { untrack } from "svelte";
  import { parseMixtapeParams } from "./_internal/parseMixtapeParams.ts";
  import { useMixtapeSession } from "./_internal/useMixtapeSession.ts";

  const { session, update } = useMixtapeSession();

  const type = $derived(parseMixtapeParams(page.url.searchParams).type);

  $effect(() => {
    void type;
    untrack(() => update({ search: "" }));
  });
</script>

<label class="trakt-mixtape-navbar-search">
  <SearchIcon />
  <input
    type="search"
    value={$session.search}
    aria-label={m.input_label_mixtape_search()}
    placeholder={type === "show"
      ? m.input_placeholder_mixtape_deck_shows()
      : m.input_placeholder_mixtape_deck_movies()}
    oninput={(event) => update({ search: event.currentTarget.value })}
  />
</label>

<style lang="scss">
  .trakt-mixtape-navbar-search {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    width: var(--width-mixtape-navbar-search, auto);
    min-width: 0;
    height: 100%;
    padding-inline-start: var(--ni-10);
    cursor: text;

    :global(svg) {
      flex: none;
      width: var(--ni-18);
      height: var(--ni-18);
      color: var(--color-text-secondary);
    }

    input {
      all: unset;
      flex: 1;
      min-width: 0;
      height: 100%;

      color: var(--color-text-primary);
      font-size: var(--font-size-text);

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }
</style>
