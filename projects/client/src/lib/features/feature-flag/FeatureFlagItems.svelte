<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { m } from "$lib/features/i18n/messages";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { FeatureFlag } from "./models/FeatureFlag";
  import { featureFlagDefinitions } from "./models/featureFlagDefinitions";
  import { useFeatureFlag } from "./useFeatureFlag";

  const { classList = "" }: { classList?: string } = $props();

  const { flags, setFlag } = useFeatureFlag();
  const featureFlags = Object.values(FeatureFlag);
  const hasFlags = featureFlags.length > 0;
</script>

{#if hasFlags}
  <div class="feature-flag-list" use:appendClassList={classList}>
    {#each featureFlags as key (key)}
      {@const value = $flags[key]}
      {@const definition = featureFlagDefinitions[key]}
      {@const Icon = definition.icon}
      {@const title = definition.title()}
      {@const description = definition.description?.() ?? ""}
      {@const featureLink = definition.featureLink?.()}
      <div class="feature-flag-item">
        <div class="feature-flag-icon">
          <Icon />
        </div>

        <div class="feature-flag-copy">
          <span class="feature-flag-title bold">{title}</span>
          {#if description}
            <p class="feature-flag-description secondary small">
              {description}
            </p>
          {/if}
        </div>

        <div class="feature-flag-actions">
          <Switch
            color="purple"
            label={title}
            checked={value}
            innerText={value ? "On" : "Off"}
            onclick={() => setFlag(key, !value)}
          />

          <span class="feature-flag-link" aria-hidden={!value || !featureLink}>
            {#if value && featureLink}
              <Link
                href={featureLink.href}
                label={featureLink.label()}
                color="inherit"
              >
                <CaretRightIcon />
              </Link>
            {/if}
          </span>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <p class="bold">{m.text_placeholder_preview_features()}</p>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .feature-flag-list {
    overflow: hidden;
    max-width: var(--ni-640);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }
  }

  .feature-flag-item {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-height: var(--ni-80);
    padding: var(--gap-s) var(--gap-m);
    box-sizing: border-box;

    .feature-flag-icon {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: var(--ni-36);
      height: var(--ni-36);
      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--purple-500) 15%, transparent);
      color: var(--purple-500);

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    .feature-flag-copy {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--gap-xxs);
      min-width: 0;
    }

    .feature-flag-description {
      line-height: 1.3;
      white-space: pre-line;
    }

    .feature-flag-actions {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      gap: var(--gap-xs);
    }

    .feature-flag-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--ni-28);
      height: var(--ni-28);
      opacity: 0.35;
      color: var(--color-text-secondary);
      text-decoration: none;

      :global(.trakt-link) {
        display: flex;
        color: inherit;
        text-decoration: none;
      }

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }

    @include for-mobile {
      align-items: flex-start;

      .feature-flag-actions {
        flex-direction: column;
      }
    }
  }
</style>
