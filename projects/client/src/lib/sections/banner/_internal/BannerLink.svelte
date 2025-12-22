<script lang="ts">
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { Snippet } from "svelte";

  const {
    children,
    href,
    target,
    source,
    tag,
  }: ChildrenProps &
    Pick<HTMLAnchorProps, "href" | "target"> & {
      source: string;
      tag?: Snippet;
    } = $props();
  const { track } = useTrack(AnalyticsEvent.Link);
</script>

<div class="trakt-banner-link">
  {#if tag}
    {@render tag()}
  {/if}

  <Link
    {href}
    {target}
    onclick={() => track({ source, target: href ?? "banner-link" })}
  >
    <ExternalLinkIcon size="small" />
    <span class="no-wrap">{@render children()}</span>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-banner-link {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      background-color: var(--purple-500);
      border-radius: var(--border-radius-l);
      padding: var(--ni-8) var(--ni-12);

      text-decoration: none;

      transition: padding var(--transition-increment) ease-in-out;

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }

      @include for-mouse() {
        &:hover {
          color: var(--purple-100);
        }
      }
    }

    @include for-tablet-lg {
      flex-direction: column-reverse;
      gap: var(--gap-micro);

      :global(.trakt-link) {
        padding: var(--ni-4) var(--ni-10);
      }
    }

    @include for-tablet-sm-and-below {
      flex-direction: row-reverse;
      gap: var(--gap-xs);
    }
  }
</style>
