<script lang="ts">
  import type { Snippet } from "svelte";
  import SettingsCrumb from "./SettingsCrumb.svelte";

  const {
    title,
    description,
    crumb,
    action,
    children,
  }: ChildrenProps & {
    title?: string;
    description?: string;
    crumb?: { href: string; label: string };
    action?: Snippet;
  } = $props();
</script>

<section class="trakt-settings-section">
  {#if title || crumb || description}
    <header class="settings-section-header">
      <div class="header-text">
        {#if title || crumb}
          <p class="settings-title bold" class:has-prefix={Boolean(crumb)}>
            {#if crumb}<SettingsCrumb
                href={crumb.href}
                label={crumb.label}
              />{/if}{title}
          </p>
        {/if}
        {#if description}
          <p class="secondary">{description}</p>
        {/if}
      </div>

      {#if action}
        <div class="header-action">{@render action()}</div>
      {/if}
    </header>
  {/if}

  {@render children()}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    min-width: 0;
  }

  .settings-section-header {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);

    @include for-tablet-sm-and-below {
      padding-inline: var(--gap-m);
    }
  }

  .header-text {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .header-action {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .settings-title {
    font-size: var(--font-size-title);

    &.has-prefix {
      display: flex;
      align-items: baseline;
      gap: var(--ni-6);

      :global(span),
      :global(.trakt-link) {
        font-size: inherit;
        font-weight: inherit;
      }
    }
  }
</style>
