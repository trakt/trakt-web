<script lang="ts">
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";

  type PlexVipUpsellProps = {
    title: string;
    description: string;
    source: string;
  };

  const { title, description, source }: PlexVipUpsellProps = $props();
</script>

<div class="trakt-plex-vip-upsell">
  <div class="upsell-main">
    <span class="upsell-cue" aria-hidden="true">
      <PlexLogo />
    </span>

    <div class="upsell-copy">
      <p class="trakt-card-title bold">{title}</p>
      <p class="tag secondary upsell-description">{description}</p>
    </div>
  </div>

  <div class="upsell-divider"></div>

  <div class="upsell-cta">
    <GetVIPLink {source} />
  </div>
</div>

<style lang="scss">
  .trakt-plex-vip-upsell {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--gap-m);
    border-radius: var(--border-radius-l);

    background: color-mix(in srgb, var(--purple-500) 14%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 45%, transparent);
  }

  .upsell-main {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .upsell-cue {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    padding: var(--ni-10) var(--ni-12);
    height: var(--ni-40);
    box-sizing: border-box;
    border-radius: var(--border-radius-m);

    color: var(--color-foreground);
    background: color-mix(in srgb, var(--purple-500) 22%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 45%, transparent);

    :global(svg) {
      width: auto;
      height: 100%;
    }
  }

  .upsell-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .upsell-description {
    color: var(--color-text-secondary);
  }

  .upsell-divider {
    height: var(--ni-1);
    background: color-mix(in srgb, var(--purple-500) 30%, transparent);
  }

  .upsell-cta {
    display: flex;
    align-items: center;
  }
</style>
