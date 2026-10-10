<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import {
    type YirPersonaId,
    YirPersonaIdSchema,
  } from "$lib/requests/models/YirPersonaId";
  import * as m from "$lib/features/i18n/messages";
  import { parsePersonaPreview } from "./parsePersonaPreview";
  import { personaCopy } from "./persona/personaCopy";

  const {
    persona,
    runnerUp,
    isRaised = false,
  }: {
    persona: YirPersonaId | Nil;
    runnerUp: YirPersonaId | Nil;
    isRaised?: boolean;
  } = $props();

  const personas = YirPersonaIdSchema.options;
  const realData = "real";

  let isOpen = $state(false);

  const setParams = (params: Record<string, string | null>) => {
    const url = new URL(page.url);
    Object.entries(params).forEach(([key, value]) =>
      value === null
        ? url.searchParams.delete(key)
        : url.searchParams.set(key, value),
    );
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  };

  const runnerValue = $derived(page.url.searchParams.get("runner") ?? "auto");
  const personaValue = $derived(
    parsePersonaPreview(page.url.searchParams)?.persona ?? realData,
  );
</script>

<div
  class="trakt-yir-persona-toggles"
  class:is-open={isOpen}
  class:is-raised={isRaised}
>
  <button
    class="yir-toggles-handle"
    type="button"
    aria-expanded={isOpen}
    onclick={() => (isOpen = !isOpen)}
  >
    {m.yir_2026_preview_title()}
  </button>

  {#if isOpen}
    <div class="yir-toggles-body">
      <label>
        <span>{m.yir_2026_preview_persona()}</span>
        <select
          value={personaValue}
          onchange={(event) =>
            event.currentTarget.value === realData
              ? setParams({ persona: null, runner: null })
              : setParams({ persona: event.currentTarget.value })}
        >
          <option value={realData}>{m.yir_2026_preview_real_data()}</option>
          {#each personas as id (id)}
            <option value={id}>{personaCopy(id).name}</option>
          {/each}
        </select>
      </label>

      <label>
        <span>{m.yir_2026_preview_runner_up()}</span>
        <select
          value={runnerValue}
          disabled={personaValue === realData}
          onchange={(event) =>
            setParams({
              runner:
                event.currentTarget.value === "auto"
                  ? null
                  : event.currentTarget.value,
            })}
        >
          <option value="auto">
            {runnerUp
              ? m.yir_2026_preview_runner_default_named({
                  persona: personaCopy(runnerUp).name,
                })
              : m.yir_2026_preview_runner_default()}
          </option>
          <option value="none">{m.yir_2026_preview_runner_none()}</option>
          {#each personas.filter((id) => id !== persona) as id (id)}
            <option value={id}>{personaCopy(id).name}</option>
          {/each}
        </select>
      </label>

      <div class="yir-toggles-actions">
        <button type="button" onclick={() => setParams({ reel: "1" })}>
          ▶ {m.yir_2026_preview_play_reel()}
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-yir-persona-toggles {
    position: fixed;
    inset-inline-end: var(--ni-16);
    bottom: calc(env(safe-area-inset-bottom, 0) + var(--ni-16));
    z-index: var(--layer-top);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--ni-8);
    max-width: calc(100vw - var(--ni-32));
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);

    &.is-raised {
      bottom: calc(env(safe-area-inset-bottom, 0) + var(--ni-160));
    }
  }

  .yir-toggles-handle,
  .yir-toggles-body {
    background: var(--color-background);
    color: var(--color-text-primary);
    border: var(--ni-1) dashed var(--color-yir-accent);
    border-radius: var(--border-radius-m);
  }

  .yir-toggles-handle {
    padding: var(--ni-6) var(--ni-12);
    font: inherit;
    cursor: pointer;
  }

  .yir-toggles-body {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    padding: var(--ni-12);
    width: var(--ni-240);
    max-width: 100%;

    label {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
    }

    select {
      font: inherit;
      padding: var(--ni-4);
    }
  }

  .yir-toggles-actions {
    display: flex;
    gap: var(--ni-6);

    button {
      flex: 1;
      padding: var(--ni-6);
      font: inherit;
      cursor: pointer;
    }
  }
</style>
