<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import Toggler from "$lib/components/toggles/Toggler.svelte";

  type SwitchColor = "purple" | "red" | "blue" | "orange";
  type MediaType = "show" | "movie";
  type DiscoverMode = "media" | MediaType;
  type SearchMode = DiscoverMode | "people" | "lists";
  type CommentMode = "likes" | "newest";
  type ActivityMode = "reviews" | "ratings";
  type LibraryMode = "plex" | "other";
  type ProgressMode = "completed" | "in-progress" | "dropped";
  type SocialMode = "following" | "followers";
  type TriviaMode = "no-spoilers" | "spoilers";

  type SwitchExample = {
    title: string;
    label: string;
    detail: string;
    color: SwitchColor;
    checked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    innerText?: string;
  };

  const option = <T,>(
    value: T,
    text: string,
    label = text,
  ): ToggleOption<T> => ({
    value,
    text: () => text,
    label: () => label,
  });

  const switchExamples: SwitchExample[] = [
    {
      title: "Default on",
      detail: "Enabled state with inner text.",
      label: "Toggle web availability",
      color: "purple",
      checked: true,
      innerText: "Web",
    },
    {
      title: "Default off",
      detail: "Unchecked setting state.",
      label: "Toggle notification sync",
      color: "red",
    },
    {
      title: "Active",
      detail: "Checked state without inner text.",
      label: "Toggle calendar sync",
      color: "blue",
      checked: true,
    },
    {
      title: "Mixed",
      detail: "Indeterminate state for partial selection.",
      label: "Toggle partial library selection",
      color: "orange",
      indeterminate: true,
    },
    {
      title: "Disabled on",
      detail: "Unavailable checked state.",
      label: "Disabled enabled switch",
      color: "purple",
      checked: true,
      disabled: true,
    },
    {
      title: "Disabled off",
      detail: "Unavailable unchecked state with text.",
      label: "Disabled web switch",
      color: "blue",
      innerText: "Web",
      disabled: true,
    },
  ];

  const mediaTypeOptions: ToggleOption<MediaType>[] = [
    option("show", "Shows", "Toggle to shows"),
    option("movie", "Movies", "Toggle to movies"),
  ];

  const discoverOptions: ToggleOption<DiscoverMode>[] = [
    option("media", "Media", "Toggle to all media"),
    option("show", "Shows", "Toggle to shows"),
    option("movie", "Movies", "Toggle to movies"),
  ];

  const searchOptions: ToggleOption<SearchMode>[] = [
    option("media", "Media", "Search all media"),
    option("show", "Shows", "Search shows"),
    option("movie", "Movies", "Search movies"),
    option("people", "People", "Search people"),
    option("lists", "Lists", "Search lists"),
  ];

  const commentOptions: ToggleOption<CommentMode>[] = [
    option("likes", "Popular", "Sort by popular comments"),
    option("newest", "Recent", "Sort by recent comments"),
  ];

  const activityOptions: ToggleOption<ActivityMode>[] = [
    option("reviews", "Reviews", "Show review activity"),
    option("ratings", "Ratings", "Show rating activity"),
  ];

  const libraryOptions: ToggleOption<LibraryMode>[] = [
    option("plex", "Plex", "Show Plex library"),
    option("other", "Custom", "Show custom library"),
  ];

  const progressOptions: ToggleOption<ProgressMode>[] = [
    option("completed", "Completed", "Show completed shows"),
    option("in-progress", "Watching", "Show shows in progress"),
    option("dropped", "Dropped", "Show dropped shows"),
  ];

  const socialOptions: ToggleOption<SocialMode>[] = [
    option("following", "Following", "Show following"),
    option("followers", "Followers", "Show followers"),
  ];

  const triviaOptions: ToggleOption<TriviaMode>[] = [
    option("no-spoilers", "No spoilers", "Hide spoiler trivia"),
    option("spoilers", "Spoilers", "Show spoiler trivia"),
  ];

  let mediaType = $state<MediaType>("show");
  let discoverMode = $state<DiscoverMode>("media");
  let searchMode = $state<SearchMode>("media");
  let commentMode = $state<CommentMode>("likes");
  let activityMode = $state<ActivityMode>("reviews");
  let libraryMode = $state<LibraryMode>("plex");
  let progressMode = $state<ProgressMode>("completed");
  let socialMode = $state<SocialMode>("following");
  let triviaMode = $state<TriviaMode>("no-spoilers");
</script>

<main>
  <div class="toggle-display">
    <section>
      <h2>Switches</h2>

      <div class="switch-grid">
        {#each switchExamples as example}
          <article class="toggle-row">
            <div>
              <h3>{example.title}</h3>
              <p class="secondary">{example.detail}</p>
            </div>

            <Switch
              checked={example.checked}
              disabled={example.disabled}
              indeterminate={example.indeterminate}
              innerText={example.innerText}
              label={example.label}
              color={example.color}
            />
          </article>
        {/each}
      </div>
    </section>

    <section>
      <h2>Media Type</h2>

      <div class="media-toggle-stack">
        <article class="toggle-example">
          <div class="example-header">
            <h3>Smart list media</h3>
            <p class="secondary">{mediaType === "show" ? "Shows" : "Movies"}</p>
          </div>

          <Toggler
            value={mediaType}
            variant="text"
            options={mediaTypeOptions}
            onChange={(value) => (mediaType = value)}
          />
        </article>

        <article class="toggle-example">
          <div class="example-header">
            <h3>Discover mode</h3>
            <p class="secondary">
              {discoverOptions
                .find((item) => item.value === discoverMode)
                ?.text()}
            </p>
          </div>

          <Toggler
            value={discoverMode}
            variant="text"
            options={discoverOptions}
            onChange={(value) => (discoverMode = value)}
          />
        </article>

        <article class="toggle-example wide">
          <div class="example-header">
            <h3>Search mode</h3>
            <p class="secondary">
              {searchOptions.find((item) => item.value === searchMode)?.text()}
            </p>
          </div>

          <Toggler
            value={searchMode}
            variant="text"
            options={searchOptions}
            onChange={(value) => (searchMode = value)}
          />
        </article>
      </div>
    </section>

    <section>
      <h2>Header Actions</h2>

      <div class="header-examples">
        <article class="section-header-demo">
          <div>
            <h3>Comments</h3>
            <p class="secondary">
              {commentOptions
                .find((item) => item.value === commentMode)
                ?.text()}
            </p>
          </div>

          <Toggler
            value={commentMode}
            options={commentOptions}
            onChange={(value) => (commentMode = value)}
          />
        </article>

        <article class="section-header-demo">
          <div>
            <h3>Progress</h3>
            <p class="secondary">
              {progressOptions
                .find((item) => item.value === progressMode)
                ?.text()}
            </p>
          </div>

          <Toggler
            value={progressMode}
            options={progressOptions}
            onChange={(value) => (progressMode = value)}
          />
        </article>
      </div>
    </section>

    <section>
      <h2>Rows</h2>

      <div class="row-examples">
        <article class="toggle-row">
          <div>
            <h3>Library source</h3>
            <p class="secondary">
              {libraryOptions
                .find((item) => item.value === libraryMode)
                ?.text()}
            </p>
          </div>

          <Toggler
            value={libraryMode}
            options={libraryOptions}
            onChange={(value) => (libraryMode = value)}
          />
        </article>

        <article class="toggle-row">
          <div>
            <h3>Activity type</h3>
            <p class="secondary">
              {activityOptions
                .find((item) => item.value === activityMode)
                ?.text()}
            </p>
          </div>

          <Toggler
            value={activityMode}
            options={activityOptions}
            onChange={(value) => (activityMode = value)}
          />
        </article>

        <article class="toggle-row">
          <div>
            <h3>Social list</h3>
            <p class="secondary">
              {socialOptions.find((item) => item.value === socialMode)?.text()}
            </p>
          </div>

          <Toggler
            value={socialMode}
            options={socialOptions}
            onChange={(value) => (socialMode = value)}
          />
        </article>

        <article class="toggle-row">
          <div>
            <h3>Trivia detail</h3>
            <p class="secondary">
              {triviaOptions.find((item) => item.value === triviaMode)?.text()}
            </p>
          </div>

          <Toggler
            value={triviaMode}
            options={triviaOptions}
            onChange={(value) => (triviaMode = value)}
          />
        </article>
      </div>
    </section>
  </div>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding-block: var(--ni-32);
    align-items: center;
  }

  .toggle-display {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-xl);
    width: min(var(--ni-920), calc(100% - var(--ni-32)));

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }

  section,
  .switch-grid,
  .media-toggle-stack,
  .header-examples,
  .row-examples {
    display: flex;
    flex-direction: column;
  }

  section {
    gap: var(--gap-m);
    align-items: stretch;
    min-width: 0;
  }

  .switch-grid,
  .media-toggle-stack,
  .header-examples,
  .row-examples {
    gap: var(--gap-m);
  }

  .toggle-example,
  .section-header-demo,
  .toggle-row {
    display: flex;
    gap: var(--gap-m);
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
  }

  .toggle-example {
    flex-direction: column;
    align-items: start;
    padding: var(--ni-16);
    overflow-x: auto;

    &.wide {
      grid-column: 1 / -1;
    }
  }

  .example-header,
  .section-header-demo > div,
  .toggle-row > div {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .section-header-demo,
  .toggle-row {
    align-items: center;
    justify-content: space-between;
    padding: var(--ni-16);
  }

  .toggle-row {
    min-height: var(--ni-72);
  }

  h2,
  h3,
  p {
    margin: 0;
  }

  @include for-tablet-sm-and-below {
    .section-header-demo,
    .toggle-row {
      align-items: start;
      flex-direction: column;
    }
  }
</style>
