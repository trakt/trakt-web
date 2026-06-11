<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";

  type DrawerDemo = "normal" | "large" | "auto" | "overlay" | "vip";

  let activeDrawer = $state<DrawerDemo | null>(null);

  const openDrawer = (drawer: DrawerDemo) => {
    activeDrawer = drawer;
  };

  const closeDrawer = () => {
    activeDrawer = null;
  };

  const metrics = [
    ["Runtime", "2h 12m"],
    ["Released", "2024"],
    ["Plays", "18"],
  ] as const;

  const activityItems = [
    "Watched on Saturday night",
    "Added to favorites",
    "Rated 8 out of 10",
    "Shared with two friends",
  ] as const;

  const overlayItems = Array.from({ length: 12 }, (_, index) => ({
    title: `Season ${index + 1}`,
    subtitle: `${(index + 1) * 8} episodes`,
  }));
</script>

{#snippet badge()}
  <VipBadge />
{/snippet}

<main>
  <div class="drawer-display">
    <section>
      <h2>Sizes</h2>

      <div class="drawer-actions">
        <Button
          color="purple"
          label="Open normal drawer"
          onclick={() => openDrawer("normal")}
        >
          Normal
        </Button>
        <Button
          color="blue"
          label="Open large drawer"
          onclick={() => openDrawer("large")}
        >
          Large
        </Button>
        <Button
          color="default"
          label="Open auto drawer"
          onclick={() => openDrawer("auto")}
        >
          Auto
        </Button>
      </div>
    </section>

    <section>
      <h2>Variants</h2>

      <div class="drawer-actions">
        <Button
          color="purple"
          label="Open overlay header drawer"
          onclick={() => openDrawer("overlay")}
        >
          Overlay header
        </Button>
        <Button
          color="red"
          label="Open VIP drawer"
          onclick={() => openDrawer("vip")}
        >
          VIP
        </Button>
      </div>
    </section>
  </div>
</main>

{#if activeDrawer === "normal"}
  <Drawer
    onClose={closeDrawer}
    title="Movie details"
    metaInfo="Dune: Part Two"
  >
    <div class="drawer-content">
      <p>
        Paul Atreides unites with Chani and the Fremen while seeking revenge
        against the conspirators who destroyed his family.
      </p>

      <div class="metric-list">
        {#each metrics as [label, value]}
          <div class="metric-row">
            <span class="secondary">{label}</span>
            <span class="bold">{value}</span>
          </div>
        {/each}
      </div>
    </div>
  </Drawer>
{/if}

{#if activeDrawer === "large"}
  <Drawer onClose={closeDrawer} title="Watch activity" size="large">
    <div class="drawer-content">
      {#each activityItems as item}
        <article class="activity-row">
          <span class="activity-marker"></span>
          <div>
            <h3>{item}</h3>
            <p class="secondary">Synced with your Trakt history.</p>
          </div>
        </article>
      {/each}
    </div>
  </Drawer>
{/if}

{#if activeDrawer === "auto"}
  <Drawer onClose={closeDrawer} title="Sort options" size="auto">
    <div class="drawer-content compact">
      <Button color="purple" label="Sort by recently watched">
        Recently watched
      </Button>
      <Button color="default" label="Sort by highest rated">
        Highest rated
      </Button>
      <Button color="default" label="Sort by release date">
        Release date
      </Button>
    </div>
  </Drawer>
{/if}

{#if activeDrawer === "overlay"}
  <Drawer
    onClose={closeDrawer}
    title="Seasons"
    metaInfo="The Bear"
    size="large"
    headerVariant="overlay"
  >
    <div class="overlay-cover">
      <span class="bold">The Bear</span>
      <span class="secondary">FX original series</span>
    </div>

    <div class="drawer-content">
      {#each overlayItems as item}
        <article class="season-row">
          <h3>{item.title}</h3>
          <p class="secondary">{item.subtitle}</p>
        </article>
      {/each}
    </div>
  </Drawer>
{/if}

{#if activeDrawer === "vip"}
  <Drawer
    onClose={closeDrawer}
    title="Sentiment"
    metaInfo="VIP preview"
    variant="vip"
    {badge}
  >
    <div class="drawer-content">
      <article class="sentiment-card">
        <h3>Audience highlights</h3>
        <p>
          Viewers are responding to the cinematography, sound design, and
          desert-scale set pieces.
        </p>
      </article>
      <article class="sentiment-card">
        <h3>Common themes</h3>
        <p>
          Power, faith, loyalty, and revenge are the most frequently discussed
          topics.
        </p>
      </article>
    </div>
  </Drawer>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding-block: var(--ni-32);
    align-items: center;
  }

  .drawer-display {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-xl);
    width: min(var(--ni-920), calc(100% - var(--ni-32)));

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }

  section,
  .drawer-actions,
  .drawer-content,
  .metric-list {
    display: flex;
    flex-direction: column;
  }

  section {
    align-items: start;
    gap: var(--gap-m);
  }

  .drawer-actions {
    align-items: start;
    gap: var(--gap-m);
  }

  .drawer-content {
    gap: var(--gap-m);

    &.compact {
      align-items: stretch;
    }
  }

  .metric-list {
    gap: var(--gap-s);
  }

  .metric-row,
  .activity-row,
  .season-row,
  .sentiment-card {
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: color-mix(
      in srgb,
      var(--color-card-background) 80%,
      transparent
    );
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    gap: var(--gap-m);
    padding: var(--ni-12);
  }

  .activity-row {
    display: grid;
    grid-template-columns: var(--ni-12) 1fr;
    gap: var(--gap-m);
    padding: var(--ni-12);
  }

  .activity-marker {
    width: var(--ni-12);
    height: var(--ni-12);
    margin-top: var(--ni-6);
    border-radius: 50%;
    background: var(--color-link-active);
  }

  .overlay-cover {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--gap-xs);
    min-height: var(--ni-240);
    padding: var(--ni-16);
    box-sizing: border-box;

    background: var(--color-card-background);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .season-row,
  .sentiment-card {
    padding: var(--ni-16);
  }
</style>
