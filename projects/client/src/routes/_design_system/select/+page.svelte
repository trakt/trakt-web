<script lang="ts">
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";

  const mediaOptions: SelectOption[] = [
    { value: "media", label: "Media" },
    { value: "show", label: "Shows" },
    { value: "movie", label: "Movies" },
  ];

  const progressOptions: SelectOption[] = [
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "Watching" },
    { value: "dropped", label: "Dropped" },
  ];

  const searchOptions: SelectOption[] = [
    { value: "media", label: "Media" },
    { value: "show", label: "Shows" },
    { value: "movie", label: "Movies" },
    { value: "people", label: "People" },
    { value: "lists", label: "Lists" },
  ];

  let regularMedia = $state("media");
  let compactMedia = $state("media");
  let selectedLabelMedia = $state("media");
  let regularProgress = $state("completed");
  let searchValue = $state("media");
  let searchExpanded = $state(false);
</script>

{#snippet mediaIcon(option: SelectOption)}
  {#if option.value === "media"}<MediaIcon />{/if}
  {#if option.value === "show"}<ShowIcon />{/if}
  {#if option.value === "movie"}<MovieIcon />{/if}
  {#if option.value === "people"}<PeopleIcon />{/if}
  {#if option.value === "lists"}<ListIcon />{/if}
{/snippet}

<main>
  <p class="secondary">
    Inline single-select: every option stays visible while the purple selector
    slides onto the active one. <strong>Regular</strong> shows icon + label;
    <strong>compact</strong> condenses to icon-only squares for dense drawer rows.
  </p>

  <section>
    <h2>Regular</h2>
    <div class="control">
      <span class="tag secondary uppercase">Icon + label</span>
      <SegmentedSelect
        options={mediaOptions}
        value={regularMedia}
        ariaLabel="Media type"
        icon={mediaIcon}
        onChange={(value) => (regularMedia = value)}
      />
    </div>

    <div class="control">
      <span class="tag secondary uppercase">Label only (no icons)</span>
      <SegmentedSelect
        options={progressOptions}
        value={regularProgress}
        ariaLabel="Progress"
        onChange={(value) => (regularProgress = value)}
      />
    </div>
  </section>

  <section>
    <h2>Compact</h2>
    <div class="control">
      <span class="tag secondary uppercase">Icon-only squircles</span>
      <SegmentedSelect
        variant="compact"
        options={mediaOptions}
        value={compactMedia}
        ariaLabel="Media type"
        icon={mediaIcon}
        onChange={(value) => (compactMedia = value)}
      />
    </div>
  </section>

  <section>
    <h2>Selected label (mobile)</h2>
    <p class="secondary">
      Icon-only squares except the active option, which grows to reveal its
      label - the tightest labelled form, used on small screens.
    </p>
    <div class="control">
      <SegmentedSelect
        variant="selected-label"
        options={mediaOptions}
        value={selectedLabelMedia}
        ariaLabel="Media type"
        icon={mediaIcon}
        onChange={(value) => (selectedLabelMedia = value)}
      />
    </div>
  </section>

  <section>
    <h2>Expandable (search reveal)</h2>
    <p class="secondary">
      The trailing options (People &amp; Lists) fold away until
      <strong>expanded</strong>, unfolding to the right on the same instance
      while the measured selector tracks the active pill.
    </p>
    <div class="control expandable-control">
      <button
        type="button"
        class="expand-toggle"
        onclick={() => (searchExpanded = !searchExpanded)}
      >
        {searchExpanded ? "Collapse" : "Expand"} (simulate leaving / entering search)
      </button>
      <SegmentedSelect
        expandable
        collapsedCount={2}
        expanded={searchExpanded}
        options={searchOptions}
        value={searchValue}
        ariaLabel="Content type"
        icon={mediaIcon}
        onChange={(value) => (searchValue = value)}
      />
    </div>
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding-top: var(--ni-16);
    max-width: var(--ni-480);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    align-items: start;
    width: 100%;
  }

  .control {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    width: min(100%, var(--ni-320));
  }

  .expandable-control {
    width: auto;
    align-items: flex-start;
    gap: var(--gap-m);
  }

  .expand-toggle {
    align-self: flex-start;
    padding: var(--ni-8) var(--ni-16);
    border-radius: var(--border-radius-m);
    border: var(--border-thickness-xxs) solid var(--color-border);
    background-color: var(--color-card-background);
    color: var(--color-text-primary);
    cursor: pointer;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-500);
      outline-offset: var(--ni-2);
    }
  }

  h2 {
    margin: 0;
  }
</style>
