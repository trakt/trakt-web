<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<trakt-manage-subscription-button>
  <Button
    href={UrlBuilder.vip()}
    label={m.button_label_manage_subscription()}
    color="purple"
    size="small"
    variant="secondary"
    target="_blank"
  >
    {m.button_text_manage_subscription()}
    {#snippet icon()}
      <VipIcon />
    {/snippet}
  </Button>
</trakt-manage-subscription-button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-manage-subscription-button {
    :global(.trakt-button) {
      width: fit-content;

      @include for-tablet-sm-and-below {
        width: 100%;
      }
    }
  }
</style>
