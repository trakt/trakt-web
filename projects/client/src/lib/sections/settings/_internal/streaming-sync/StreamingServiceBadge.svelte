<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  type StreamingServiceBadgeProps = {
    name: string;
    logoUrl?: string | null;
    color?: string | null;
    size?: "small" | "normal";
  };

  const {
    name,
    logoUrl,
    color,
    size = "normal",
  }: StreamingServiceBadgeProps = $props();
</script>

<div
  class="trakt-streaming-service-badge"
  data-size={size}
  style={color ? `--service-color: ${color};` : undefined}
>
  {#if logoUrl}
    <img
      class="streaming-service-logo"
      src={logoUrl}
      alt={m.text_streaming_service_logo_alt({ service: name })}
      loading="lazy"
    />
  {:else}
    <span class="bold uppercase">{name}</span>
  {/if}
</div>

<style lang="scss">
  .trakt-streaming-service-badge {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-120);
    aspect-ratio: 16 / 9;
    padding: var(--ni-20);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    background-color: var(--service-color, var(--color-card-background));

    overflow: hidden;

    &[data-size="small"] {
      width: var(--ni-104);
      padding: var(--ni-14);
    }

    span {
      font-size: var(--font-size-tag);
      text-align: center;
      color: var(--color-text-primary);
    }
  }

  .streaming-service-logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
</style>
