<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Button from "$lib/components/buttons/Button.svelte";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import ErrorLockedAccountPage from "$lib/pages/errors/ErrorLockedAccountPage.svelte";
  import ErrorServicePage from "$lib/pages/errors/ErrorServicePage.svelte";
  import UnexpectedErrorPage from "$lib/pages/errors/UnexpectedErrorPage.svelte";

  const scenes = [
    {
      id: "service",
      kicker: "Intermission",
      label: "Service unreachable",
      note:
        "Fired by ErrorProvider for server and rate-limit errors. The waves " +
        "thin out to dots and pulse without ever landing.",
    },
    {
      id: "not-found",
      kicker: "Missing reel",
      label: "Page not found",
      note:
        "The 404 route and any NotFoundError. The film strip's middle frame " +
        "is punched out and keeps breathing.",
    },
    {
      id: "unexpected",
      kicker: "Bad take",
      label: "Unexpected error",
      note:
        "Anything the window error handler catches, session id and stack " +
        "included. The clapperboard claps every five seconds.",
    },
    {
      id: "locked",
      kicker: "House closed",
      label: "Account locked",
      note:
        "Usage and collection limits. Deliberately the one still mark - a " +
        "locked door should not look like it is working on it.",
    },
  ] as const;

  type SceneId = (typeof scenes)[number]["id"];

  const isSceneId = (value: string | null): value is SceneId =>
    scenes.some((scene) => scene.id === value);

  const activeId = $derived.by(() => {
    const requested = page.url.searchParams.get("scene");
    return isSceneId(requested) ? requested : "service";
  });

  const activeScene = $derived(
    scenes.find((scene) => scene.id === activeId) ?? scenes[0],
  );

  function show(id: SceneId) {
    const url = new URL(page.url);
    url.searchParams.set("scene", id);
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  const demoError = (() => {
    const error = new Error(
      "Cannot read properties of undefined (reading 'seasons')",
    );

    error.stack = [
      "TypeError: Cannot read properties of undefined (reading 'seasons')",
      "    at ShowProgress (/_app/immutable/chunks/ShowProgress.js:41:19)",
      "    at update_reaction (/_app/immutable/chunks/runtime.js:1203:6)",
      "    at flush_queued_root_effects (/_app/immutable/chunks/runtime.js:884:3)",
    ].join("\n");

    return error;
  })();
</script>

<main>
  <div class="error-display">
    <section>
      <div class="section-heading">
        <h2>Scenes</h2>
        <p class="small secondary">
          Every failure the app can land on, each with its own mark and kicker.
          The mark is animated, so give it a few seconds.
        </p>
      </div>

      <div class="scene-picker">
        {#each scenes as scene (scene.id)}
          <Button
            color="purple"
            style={scene.id === activeId ? "flat" : "outline"}
            size="small"
            label={scene.label}
            onclick={() => show(scene.id)}
          >
            {scene.label}
          </Button>
        {/each}
      </div>

      <p class="small secondary">{activeScene.note}</p>
    </section>

    <section>
      <div class="section-heading">
        <h2>{activeScene.kicker}</h2>
        <p class="small secondary">
          Rendered at the size it takes over the page. The real 404 also sits
          on any unknown URL, if you want it without the frame around it.
        </p>
      </div>

      <div class="scene-stage">
        {#if activeId === "service"}
          <ErrorServicePage />
        {/if}

        {#if activeId === "not-found"}
          <Error404Page />
        {/if}

        {#if activeId === "unexpected"}
          <UnexpectedErrorPage
            error={demoError}
            sessionId="8f3c1d24-6b90-4a7e-9c15-2de0a4f7b311"
          />
        {/if}

        {#if activeId === "locked"}
          <ErrorLockedAccountPage />
        {/if}
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

  .error-display {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    width: min(var(--ni-1280), calc(100% - var(--ni-32)));
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--gap-m);
  }

  .section-heading {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    max-width: var(--ni-640);
  }

  .scene-picker {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-s);
  }

  .scene-stage {
    width: 100%;
    height: min(var(--ni-640), 75dvh);

    overflow: auto;

    @include for-mobile {
      height: var(--ni-520);
    }
  }
</style>
