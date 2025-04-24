<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { url } = useAuth();
</script>

{#snippet joinButton(url: string)}
  <Button
    color="purple"
    href={url}
    label={m.join_trakt_button_label()}
    style="flat"
    navigationType={DpadNavigationType.Item}
  >
    {m.join_trakt_for_free_button()}
    {#snippet icon()}
      <CaretRightIcon />
    {/snippet}
  </Button>
{/snippet}

<RenderFor audience="public" navigation="default">
  {@render joinButton($url)}
</RenderFor>

<RenderFor audience="public" navigation="dpad">
  {@render joinButton(UrlBuilder.login.activate())}
</RenderFor>
