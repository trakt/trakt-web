<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<div class="trakt-vip-upsell">
  <p class="uppercase">
    {m.text_vip_upsell()}
  </p>
  <p>
    {m.text_vip_upsell_description()}
  </p>
  <Button
    href={UrlBuilder.vip()}
    label={m.button_label_get_vip()}
    color="red"
    variant="secondary"
    target="_blank"
  >
    <p class="small bold uppercase">{m.button_text_get_vip()}</p>
    {#snippet icon()}
      <VipBadge />
    {/snippet}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-upsell {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    background: var(--color-background);

    border: var(--ni-2) solid var(--color-foreground-red);
    border-radius: var(--border-radius-l);

    padding: var(--ni-24);
    box-sizing: border-box;

    p.uppercase {
      font-weight: 700;
    }

    :global(.trakt-button) {
      width: fit-content;
      align-self: flex-end;
    }

    @include for-mobile {
      padding: var(--ni-16);
    }
  }
</style>
