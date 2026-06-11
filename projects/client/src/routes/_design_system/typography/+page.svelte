<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";

  type TypeToken = {
    name: string;
    token: string;
    value: string;
    defaultUse: string;
    sample: string;
  };

  type UtilityClass = {
    name: string;
    usageCount: number;
    source: string;
    sample: string;
    className: string;
  };

  type Combination = {
    className: string;
    usage: string;
    sample: string;
  };

  const fonts = [
    {
      name: "Roboto",
      stack: '"Roboto", Arial, sans-serif',
      sample: "Movies, shows, seasons, episodes, comments, and ratings",
    },
    {
      name: "Roboto Mono",
      stack: '"Roboto Mono", "Courier New", monospace',
      sample: "2026-06-10 21:14:09 / users/me/history",
    },
  ];

  const typeTokens: TypeToken[] = [
    {
      name: "Title",
      token: "--font-size-title",
      value: "var(--ni-18)",
      defaultUse: "h1-h6 and span.title",
      sample: "Continue Watching",
    },
    {
      name: "Text",
      token: "--font-size-text",
      value: "var(--ni-14)",
      defaultUse: "p, span, and code",
      sample: "Track every movie and show you watch.",
    },
    {
      name: "Small Text",
      token: "--font-size-text-small",
      value: "var(--ni-12)",
      defaultUse: ".small utility and card subtitles",
      sample: "S02E05 - Signal and Noise",
    },
    {
      name: "Tag",
      token: "--font-size-tag",
      value: "var(--ni-10)",
      defaultUse: ".tag utility and media tags",
      sample: "Watched",
    },
    {
      name: "Separator",
      token: "--font-size-separator",
      value: "var(--ni-16)",
      defaultUse: "compact separators and count dividers",
      sample: "/",
    },
  ];

  const utilityClasses: UtilityClass[] = [
    {
      name: ".bold",
      usageCount: 204,
      source: "font-weight: 600",
      sample: "Dune: Part Two",
      className: "bold",
    },
    {
      name: ".secondary",
      usageCount: 150,
      source: "color: --color-text-secondary",
      sample: "Watched yesterday",
      className: "secondary",
    },
    {
      name: ".ellipsis",
      usageCount: 84,
      source: "single-line truncation",
      sample:
        "A deliberately long media title that should truncate inside narrow cards",
      className: "ellipsis",
    },
    {
      name: ".capitalize",
      usageCount: 45,
      source: "first-letter capitalization",
      sample: "recently watched",
      className: "capitalize",
    },
    {
      name: ".tag",
      usageCount: 39,
      source: "font-size: --font-size-tag",
      sample: "Episode",
      className: "tag",
    },
    {
      name: ".uppercase",
      usageCount: 35,
      source: "text-transform: uppercase",
      sample: "vip",
      className: "uppercase",
    },
    {
      name: ".no-wrap",
      usageCount: 30,
      source: "white-space: nowrap",
      sample: "S01E08",
      className: "no-wrap",
    },
    {
      name: ".small",
      usageCount: 22,
      source: "font-size: --font-size-text-small",
      sample: "Released in 2024",
      className: "small",
    },
    {
      name: ".title",
      usageCount: 13,
      source: "span title size",
      sample: "Your Lists",
      className: "title",
    },
    {
      name: ".italic",
      usageCount: 9,
      source: "font-style: italic",
      sample: "No activity yet",
      className: "italic",
    },
  ];

  const combinations: Combination[] = [
    {
      className: "title ellipsis",
      usage: "List headers and drawer titles",
      sample: "Recommended for You",
    },
    {
      className: "bold ellipsis",
      usage: "Card titles and compact names",
      sample: "The Last of Us",
    },
    {
      className: "secondary small ellipsis",
      usage: "Card subtitles",
      sample: "S01E03 - Long, Long Time",
    },
    {
      className: "tag bold capitalize no-wrap",
      usage: "Media tags",
      sample: "season finale",
    },
    {
      className: "bold uppercase no-wrap",
      usage: "Status labels",
      sample: "watched",
    },
    {
      className: "italic secondary",
      usage: "Empty states and helper text",
      sample: "Import fields can be left blank.",
    },
  ];
</script>

<main>
  <section>
    <h2>Fonts</h2>

    <div class="font-grid">
      {#each fonts as font}
        <article class="sample-panel">
          <div>
            <h3>{font.name}</h3>
            <p class="secondary"><code>{font.stack}</code></p>
          </div>

          <p
            class="font-sample"
            class:mono-font={font.name === "Roboto Mono"}
          >
            {font.sample}
          </p>
        </article>
      {/each}
    </div>
  </section>

  <section>
    <h2>Type Scale</h2>

    <div class="scale-grid">
      {#each typeTokens as token}
        <article
          class="scale-row"
          style:--sample-font-size={`var(${token.token})`}
        >
          <div class="scale-meta">
            <span class="bold">{token.name}</span>
            <span class="secondary"><code>{token.token}</code></span>
            <span class="secondary">{token.value}</span>
            <span class="secondary">{token.defaultUse}</span>
          </div>

          <p class="scale-sample">{token.sample}</p>
        </article>
      {/each}
    </div>
  </section>

  <section>
    <h2>Default Elements</h2>

    <div class="element-grid">
      <article class="sample-panel">
        <h3>Heading elements</h3>
        <div class="element-stack">
          <h1>h1 shares the title token</h1>
          <h2>h2 shares the title token</h2>
          <h3>h3 shares the title token</h3>
          <h4>h4 shares the title token</h4>
        </div>
      </article>

      <article class="sample-panel">
        <h3>Inline and body elements</h3>
        <div class="element-stack">
          <p>
            Paragraphs use the base text token with normal weight and primary
            color.
          </p>
          <span>Spans also use the base text token.</span>
          <code>code uses the text token and Roboto Mono.</code>
        </div>
      </article>
    </div>
  </section>

  <section>
    <h2>Utility Classes</h2>

    <div class="utility-grid">
      {#each utilityClasses as utility}
        <article class="utility-row">
          <div class="utility-meta">
            <span class="bold"><code>{utility.name}</code></span>
            <span class="secondary">{utility.source}</span>
            <span class="tag secondary">{utility.usageCount} static uses</span>
          </div>

          {#if utility.name === ".title"}
            <span class="usage-sample title">{utility.sample}</span>
          {:else}
            <p class={`usage-sample ${utility.className}`}>
              {utility.sample}
            </p>
          {/if}
        </article>
      {/each}
    </div>
  </section>

  <section>
    <h2>Common Combinations</h2>

    <div class="combination-grid">
      {#each combinations as combination}
        <article class="sample-panel">
          <div>
            <span class="bold"><code>{combination.className}</code></span>
            <p class="secondary">{combination.usage}</p>
          </div>

          <p class={`combination-sample ${combination.className}`}>
            {combination.sample}
          </p>
        </article>
      {/each}
    </div>
  </section>

  <section>
    <h2>Production Patterns</h2>

    <div class="pattern-grid">
      <article class="pattern-row">
        <div class="list-title-demo">
          <span class="title ellipsis">Watch Next</span>
          <span class="title secondary ellipsis">/ Shows</span>
        </div>
        <p class="secondary">List headers compose title-sized spans.</p>
      </article>

      <article class="pattern-row">
        <div class="media-footer-demo">
          <p class="bold ellipsis">Severance</p>
          <p class="secondary small ellipsis">S02E01 - Hello, Ms. Cobel</p>
        </div>
        <p class="secondary">Card footers pair compact titles with subtitles.</p>
      </article>

      <article class="pattern-row">
        <div class="tag-demo">
          <TextTag>
            <p class="tag bold capitalize no-wrap">premiere</p>
          </TextTag>
          <StemTag text="watched" />
        </div>
        <p class="secondary">Media tags use the tag token with bold labels.</p>
      </article>

      <article class="pattern-row">
        <div class="metadata-demo">
          <span class="secondary">Runtime</span>
          <span class="bold">2h 46m</span>
          <span class="secondary">Released</span>
          <span class="bold">2024</span>
        </div>
        <p class="secondary">Metadata rows use secondary labels and bold values.</p>
      </article>

      <article class="pattern-row long-form">
        <ClampedText label="Expand typography copy" classList="secondary" lineCount={2}>
          Typography for long summaries stays at the base text size, relies on
          secondary color when it is supporting content, and uses clamping where
          lists or summary surfaces need predictable height.
        </ClampedText>
        <p class="secondary">Long form text uses the base token and clamping.</p>
      </article>
    </div>
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main,
  section,
  .sample-panel,
  .scale-meta,
  .utility-meta,
  .element-stack,
  .media-footer-demo,
  .pattern-grid {
    display: flex;
    flex-direction: column;
  }

  main {
    gap: var(--gap-xl);
    padding-block: var(--ni-32);
    align-items: center;
  }

  section {
    gap: var(--gap-m);
    width: min(var(--ni-920), calc(100% - var(--ni-32)));
  }

  .font-grid,
  .element-grid,
  .utility-grid,
  .combination-grid,
  .pattern-grid {
    display: grid;
    gap: var(--gap-m);
  }

  .font-grid,
  .element-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .utility-grid,
  .combination-grid,
  .pattern-grid {
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-260), 1fr));
  }

  .scale-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .sample-panel,
  .scale-row,
  .utility-row,
  .pattern-row {
    gap: var(--gap-m);
    min-width: 0;
    padding: var(--ni-16);
    box-sizing: border-box;
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background-color: var(--color-card-background);
  }

  .scale-row,
  .utility-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pattern-row {
    display: flex;
    align-items: stretch;
    flex-direction: column;
    justify-content: flex-start;
  }

  .pattern-row > p {
    min-width: 0;
    line-height: 145%;
  }

  .scale-meta,
  .utility-meta,
  .element-stack,
  .media-footer-demo {
    gap: var(--gap-xs);
    min-width: 0;
  }

  .font-sample {
    line-height: 150%;
  }

  .mono-font {
    font-family: "Roboto Mono", "Courier New", monospace;
  }

  .scale-sample {
    flex: 1;
    min-width: min(var(--ni-240), 100%);
    font-size: var(--sample-font-size);
    text-align: end;
  }

  .usage-sample,
  .combination-sample {
    max-width: var(--ni-240);
    min-width: 0;
  }

  .list-title-demo,
  .tag-demo,
  .metadata-demo {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .list-title-demo {
    width: 100%;
  }

  .list-title-demo span {
    min-width: 0;
  }

  .media-footer-demo {
    width: 100%;
  }

  .tag-demo {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .metadata-demo {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    row-gap: var(--gap-xxs);
    width: min(var(--ni-180), 100%);
  }

  .metadata-demo span {
    min-width: 0;
  }

  .long-form {
    align-items: stretch;
    grid-column: 1 / -1;
  }

  code {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    min-width: 0;
    padding: var(--ni-1) var(--ni-4);
    overflow: hidden;

    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 80%, transparent);
    border-radius: var(--border-radius-s);
    background-color: color-mix(
      in srgb,
      var(--color-card-background) 86%,
      var(--color-text-primary)
    );

    color: var(--color-text-primary);
    font-family: "Roboto Mono", "Courier New", monospace;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @include for-tablet-sm-and-below {
    .font-grid,
    .element-grid,
    .utility-grid,
    .combination-grid,
    .pattern-grid {
      grid-template-columns: 1fr;
    }

    .scale-row,
    .utility-row {
      align-items: start;
      flex-direction: column;
    }

    .scale-sample {
      min-width: 0;
      text-align: start;
    }
  }
</style>
