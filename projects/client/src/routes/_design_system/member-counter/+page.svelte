<script lang="ts">
  import { useProjectedCount } from "$lib/features/member-count/useProjectedCount.svelte.ts";
  import MemberCountHero from "$lib/sections/about/components/MemberCountHero.svelte";

  // Synthetic anchor, not `useRegisteredMemberCount`: the preview must render
  // without `/v3/stats/users`, and the real rate is too slow to judge motion by.
  const DEMO_TOTAL = 17_002_054;
  const REAL_RATE_PER_DAY = 10_700;

  const RATE_PRESETS = [
    { label: "Real (~10.7k/day)", ratePerDay: REAL_RATE_PER_DAY },
    { label: "1 / second", ratePerDay: 86_400 },
    { label: "100 / second", ratePerDay: 8_640_000 },
  ];

  let anchor = $state({
    total: DEMO_TOTAL,
    anchoredAt: Date.now(),
    ratePerDay: REAL_RATE_PER_DAY,
  });

  const projected = useProjectedCount(() => anchor);

  const count = $derived({
    value: projected.value,
    reserveFor: DEMO_TOTAL,
  });

  // Always re-anchor from where the counter currently is, so a change bends the
  // curve instead of teleporting the number.
  const reanchor = (
    { total, ratePerDay }: { total: number; ratePerDay: number },
  ) => {
    anchor = { total, anchoredAt: Date.now(), ratePerDay };
  };

  const setRate = (ratePerDay: number) =>
    reanchor({ total: Math.floor(projected.value), ratePerDay });

  // Positive exercises the ease-up path, negative the never-rewind guard.
  const reanchorBy = (delta: number) =>
    reanchor({
      total: Math.floor(projected.value) + delta,
      ratePerDay: anchor.ratePerDay,
    });
</script>

<main class="trakt-member-counter-preview">
  <!-- A div, not a <header>: the PWA Android preview page ships an unscoped
       `:global(header, footer, …) { display: none !important }` that survives
       client-side navigation. -->
  <div class="preview-intro">
    <h1>Member Counter</h1>
    <p class="secondary">
      The live registered-account total as it ships on the about page: anchored
      on the server value, interpolated against the measured signup rate, and
      never rewinding. Under <code>prefers-reduced-motion: reduce</code> it falls
      back to a static, locale-formatted number with no frame loop.
    </p>
  </div>

  <section class="preview-controls card">
    <div class="control-group">
      <p class="tag secondary uppercase">Signup rate</p>
      <div class="control-buttons">
        {#each RATE_PRESETS as preset (preset.ratePerDay)}
          <button
            type="button"
            class:is-active={anchor.ratePerDay === preset.ratePerDay}
            onclick={() => setRate(preset.ratePerDay)}
          >
            {preset.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="control-group">
      <p class="tag secondary uppercase">Re-anchor</p>
      <div class="control-buttons">
        <button type="button" onclick={() => reanchorBy(500)}>
          Server ahead (+500)
        </button>
        <button type="button" onclick={() => reanchorBy(-500)}>
          Server behind (-500)
        </button>
      </div>
      <p class="caption tag secondary">
        Ahead should ease up smoothly. Behind should freeze the digits until the
        projection catches up - never count down.
      </p>
    </div>
  </section>

  <section class="preview-variant">
    <h2>Hero statement</h2>
    <p class="caption tag secondary">
      The number is the headline. Per-digit roll at display size, tight tracking,
      minimal supporting copy.
    </p>
    <div class="preview-stage"><MemberCountHero {count} /></div>
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-member-counter-preview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    // Matches the about page's own content width so the variants are judged at
    // the size they will actually ship at.
    max-width: var(--ni-1280);
    margin: 0 auto;
    padding: var(--gap-xl);
    box-sizing: border-box;
  }

  .preview-intro {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    max-width: var(--ni-640);
  }

  .preview-controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xl);

    padding: var(--gap-l);

    background: color-mix(in srgb, var(--color-card-background) 80%, transparent);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--border-radius-l);
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .control-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
  }

  .control-buttons button {
    padding: var(--gap-xs) var(--gap-m);

    color: var(--color-text-primary);
    background: var(--color-background-alternate);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);
    border-radius: var(--border-radius-m);
    cursor: pointer;

    &.is-active {
      border-color: var(--purple-500);
      color: var(--purple-400);
    }
  }

  .preview-variant {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .preview-stage {
    display: flex;
    justify-content: center;

    margin-top: var(--gap-m);
    padding: var(--gap-xxl) var(--gap-l);

    border: var(--border-thickness-xxs) dashed
      color-mix(in srgb, var(--color-border) 45%, transparent);
    border-radius: var(--border-radius-l);
  }
</style>
