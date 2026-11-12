<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { m } from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { onMount } from "svelte";
  import { isRecentlyAddedFeature } from "./isRecentlyAddedFeature.ts";
  import { FeatureFlag } from "./models/FeatureFlag";
  import { featureFlagDefinitions } from "./models/featureFlagDefinitions";
  import { useFeatureFlag } from "./useFeatureFlag";
  import { useUnreadPreviewFeatures } from "./useUnreadPreviewFeatures.ts";

  type FeatureFlagItemsProps = {
    classList?: string;
  };

  const { classList = "" }: FeatureFlagItemsProps = $props();

  const { flags, setFlag } = useFeatureFlag();
  const { track } = useTrack(AnalyticsEvent.PreviewFeature);
  const { acknowledgeUnread } = useUnreadPreviewFeatures();
  const featureFlags = Object.values(FeatureFlag);
  const isForDirectors = (key: FeatureFlag) =>
    featureFlagDefinitions[key].audience === "director";
  const vipFlags = featureFlags.filter((key) => !isForDirectors(key));
  const directorFlags = featureFlags.filter(isForDirectors);

  let newFeatures = $state<ReadonlyArray<FeatureFlag>>([]);

  onMount(() => {
    newFeatures = acknowledgeUnread();
  });

  const toggleFlag = (key: FeatureFlag, isOn: boolean) => {
    track({ id: key, state: isOn ? "off" : "on" });
    setFlag(key, !isOn);
  };
</script>

{#snippet flagItem(key: FeatureFlag)}
  {@const value = $flags[key]}
  {@const definition = featureFlagDefinitions[key]}
  {@const Icon = definition.icon}
  {@const title = definition.title()}
  {@const description = definition.description?.() ?? ""}
  {@const featureLink = definition.featureLink?.()}
  {@const isNew =
    newFeatures.includes(key) || isRecentlyAddedFeature(definition.addedAt)}
  <div class="feature-flag-item">
    <div class="feature-flag-icon">
      <Icon />
    </div>

    <div class="feature-flag-copy">
      <span class="feature-flag-title-row">
        <span class="feature-flag-title bold">{title}</span>
        {#if isNew}
          <StemTag
            text={m.tag_text_new_preview_feature()}
            classList="feature-flag-new-tag"
            --color-background-stem-tag="var(--color-background-purple)"
            --color-foreground-stem-tag="var(--color-foreground-purple)"
          />
        {/if}
      </span>
      {#if description}
        <p class="feature-flag-description secondary small">
          {description}
        </p>
      {/if}
    </div>

    <div class="feature-flag-actions">
      <Switch
        label={title}
        checked={value}
        onclick={() => toggleFlag(key, value)}
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
{/snippet}

<div class="trakt-feature-flag-groups" use:appendClassList={classList}>
  <RenderFor audience="vip">
    {#if vipFlags.length > 0}
      <div class="feature-flag-list">
        {#each vipFlags as key (key)}
          {@render flagItem(key)}
        {/each}
      </div>
    {:else}
      <p class="bold">{m.text_placeholder_preview_features()}</p>
    {/if}
  </RenderFor>

  {#if directorFlags.length > 0}
    <RenderFor audience="director">
      <section class="feature-flag-group">
        <h3 class="feature-flag-group-title tag secondary">Director flags</h3>
        <div class="feature-flag-list">
          {#each directorFlags as key (key)}
            {@render flagItem(key)}
          {/each}
        </div>
      </section>
    </RenderFor>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-feature-flag-groups {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .feature-flag-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .feature-flag-group-title {
    margin: 0;
    padding-inline-start: var(--gap-m);
    text-transform: uppercase;
  }

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

    .feature-flag-title-row {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-width: 0;

      :global(.feature-flag-new-tag) {
        flex-shrink: 0;
      }
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
