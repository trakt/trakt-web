<script lang="ts">
  const {
    eyebrow,
    title,
    description,
  }: { eyebrow: string; title: string; description?: string | Nil } = $props();
</script>

<div class="trakt-vip-cancel-heading">
  <span class="heading-eyebrow small">{eyebrow}</span>
  <h1 class="heading-title">{title}</h1>
  {#if description}
    <p class="heading-description">{description}</p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-heading {
    display: grid;
    justify-items: start;
    gap: var(--gap-m);
  }

  .heading-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    padding: var(--ni-6) var(--ni-14);
    border: var(--ni-1) solid var(--deck-card-line);
    border-radius: var(--border-radius-xxl);
    color: var(--deck-card-muted);

    &::before {
      content: "";
      width: var(--ni-6);
      height: var(--ni-6);
      border-radius: 50%;
      background: var(--purple-400);
      box-shadow: 0 0 var(--ni-10) var(--purple-400);
    }
  }

  .heading-title {
    margin: 0;
    font-size: clamp(var(--ni-32), 5.6cqi, var(--ni-64));
    font-weight: 900;
    line-height: 0.96;
    letter-spacing: -0.05em;
    text-wrap: balance;
  }

  .heading-description {
    margin: 0;
    max-width: var(--ni-480);
    font-size: var(--ni-18);
    line-height: 1.45;
    color: var(--deck-card-muted);
    text-wrap: pretty;

    @container vip-cancel (max-width: 760px) {
      font-size: var(--ni-16);
    }
  }
</style>
