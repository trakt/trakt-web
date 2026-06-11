<script lang="ts">
  type ColorToken = {
    name: string;
    token: string;
  };

  type ColorGroup = {
    title: string;
    tokens: ColorToken[];
  };

  const createScale = (name: string, values: readonly number[]): ColorGroup => ({
    title: name,
    tokens: values.map((value) => ({
      name: String(value),
      token: `--${name.toLowerCase()}-${value}`,
    })),
  });

  const paletteGroups: ColorGroup[] = [
    createScale("Purple", [
      50,
      60,
      70,
      80,
      90,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      950,
      1000,
    ]),
    createScale("Red", [
      20,
      50,
      60,
      70,
      80,
      90,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      950,
      975,
      1000,
    ]),
    createScale("Blue", [
      50,
      60,
      70,
      80,
      90,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
    ]),
    createScale("Green", [
      50,
      60,
      70,
      80,
      90,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
    ]),
    createScale("Orange", [
      50,
      60,
      70,
      80,
      90,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
    ]),
    createScale("Yellow", [
      50,
      60,
      70,
      80,
      90,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
    ]),
    createScale("Shade", [
      10,
      20,
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      910,
      920,
      930,
      940,
      950,
      1000,
    ]),
  ];

  const semanticGroups: ColorGroup[] = [
    {
      title: "Surface",
      tokens: [
        { name: "Background", token: "--color-background" },
        { name: "Floating", token: "--color-floating-background" },
        { name: "Card", token: "--color-card-background" },
        { name: "Modal", token: "--color-modal-background" },
        { name: "Drawer", token: "--color-drawer-background" },
        { name: "Dialog", token: "--color-dialog-background" },
        { name: "Input", token: "--color-input-background" },
        { name: "Border", token: "--color-border" },
      ],
    },
    {
      title: "Text",
      tokens: [
        { name: "Foreground", token: "--color-foreground" },
        { name: "Primary", token: "--color-text-primary" },
        { name: "Secondary", token: "--color-text-secondary" },
        { name: "Emphasis", token: "--color-text-emphasis" },
        { name: "Link active", token: "--color-link-active" },
      ],
    },
    {
      title: "Actions",
      tokens: [
        { name: "Purple background", token: "--color-background-purple" },
        { name: "Purple foreground", token: "--color-foreground-purple" },
        { name: "Red background", token: "--color-background-red" },
        { name: "Red foreground", token: "--color-foreground-red" },
        { name: "Blue background", token: "--color-background-blue" },
        { name: "Blue foreground", token: "--color-foreground-blue" },
        { name: "Default background", token: "--color-background-default" },
        { name: "Default foreground", token: "--color-foreground-default" },
        { name: "Orange background", token: "--color-background-orange" },
        { name: "Orange foreground", token: "--color-foreground-orange" },
      ],
    },
    {
      title: "Tags",
      tokens: [
        { name: "Stem background", token: "--color-background-stem-tag" },
        { name: "Stem foreground", token: "--color-foreground-stem-tag" },
        { name: "Progress background", token: "--color-background-progress-tag" },
        { name: "Progress text", token: "--color-text-progress-tag" },
        { name: "Preview background", token: "--color-background-preview-tag" },
        { name: "Preview text", token: "--color-text-preview-tag" },
        { name: "Watch count background", token: "--color-background-watch-count-tag" },
        { name: "Watch count text", token: "--color-text-watch-count-tag" },
      ],
    },
    {
      title: "Feedback",
      tokens: [
        { name: "Input focus", token: "--color-input-focus" },
        { name: "Input error", token: "--color-input-error" },
        { name: "Sentiment good", token: "--color-sentiment-good" },
        { name: "Sentiment bad", token: "--color-sentiment-bad" },
        { name: "Ratings Trakt", token: "--color-ratings-trakt" },
        { name: "VIP badge", token: "--color-background-vip-badge" },
      ],
    },
  ];
</script>

<main>
  <section>
    <h2>Palettes</h2>

    <div class="color-groups">
      {#each paletteGroups as group}
        <article class="color-group">
          <h3>{group.title}</h3>

          <div class="swatch-grid">
            {#each group.tokens as color}
              <div class="swatch" style:--swatch-color={`var(${color.token})`}>
                <span class="swatch-preview"></span>
                <span class="bold">{color.name}</span>
                <span class="secondary">{color.token}</span>
              </div>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section>
    <h2>Semantic Tokens</h2>

    <div class="color-groups semantic-groups">
      {#each semanticGroups as group}
        <article class="color-group">
          <h3>{group.title}</h3>

          <div class="swatch-grid semantic-grid">
            {#each group.tokens as color}
              <div class="swatch" style:--swatch-color={`var(${color.token})`}>
                <span class="swatch-preview"></span>
                <span class="bold">{color.name}</span>
                <span class="secondary">{color.token}</span>
              </div>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main,
  section,
  .color-groups,
  .color-group,
  .swatch {
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

  .color-groups {
    gap: var(--gap-xl);
  }

  .semantic-groups {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }

  .color-group {
    gap: var(--gap-m);
  }

  .swatch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-144), 1fr));
    gap: var(--gap-m);
  }

  .semantic-grid {
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-180), 1fr));
  }

  .swatch {
    gap: var(--gap-xs);
    min-width: 0;
  }

  .swatch-preview {
    width: 100%;
    aspect-ratio: 16 / 9;
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: var(--swatch-color);
  }
</style>
