<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { TodayDrawerHeaderProps } from "./TodayDrawerHeaderProps.ts";

  const { href, cover, title, meta, lead, badges }: TodayDrawerHeaderProps =
    $props();
</script>

<div class="trakt-today-drawer-header">
  <Link {href} label={title} color="inherit">
    <div class="header-card">
      <div class="header-backdrop" aria-hidden="true">
        <CrossOriginImage src={cover} alt="" />
      </div>

      <div class="header-content">
        <div class="header-lead">
          {@render lead()}
        </div>
        <div class="header-text">
          <h2 class="ellipsis header-title">{title}</h2>
          <p class="small secondary ellipsis">{meta}</p>
          {#if badges}
            <div class="header-badges">{@render badges()}</div>
          {/if}
        </div>
        <span class="header-caret" aria-hidden="true">
          <CaretRightIcon />
        </span>
      </div>
    </div>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-drawer-header {
    :global(.trakt-link) {
      display: block;
      border-radius: var(--border-radius-l);
      text-decoration: none;
    }

    :global(.trakt-link:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--color-text-emphasis);
      outline-offset: var(--ni-2);
    }
  }

  .header-card {
    position: relative;
    overflow: hidden;

    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--purple-400) 40%, transparent);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);

    transition: border-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        border-color: var(--color-text-emphasis);

        .header-backdrop :global(img) {
          transform: scale(1.04);
        }

        .header-caret {
          transform: translateX(calc(var(--rtl-sign, 1) * var(--ni-2)));
        }
      }
    }
  }

  .header-backdrop {
    position: absolute;
    inset: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.55;

      transition: transform calc(var(--transition-duration-short) * 2)
        ease-out;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        var(--color-card-background) 15%,
        color-mix(in srgb, var(--color-card-background) 40%, transparent)
      );
    }
  }

  .header-content {
    position: relative;

    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--gap-m);
  }

  .header-lead {
    flex-shrink: 0;
  }

  .header-text {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    flex-grow: 1;
    min-width: 0;
  }

  .header-title {
    margin: 0;
  }

  .header-badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs);
    margin-top: var(--gap-xxs);
  }

  .header-caret {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);

    transition: transform var(--transition-increment) ease-out;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .header-card,
    .header-backdrop :global(img),
    .header-caret {
      transition: none;
    }
  }
</style>
