<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { url } = useAuth();
</script>

{#snippet joinButton(url: string)}
  <Button
    href={url}
    label={m.button_label_join_trakt()}
    style="flat"
    size="small"
    color="purple"
    variant="primary"
    navigationType={DpadNavigationType.Item}
  >
    {m.button_text_join_trakt()}
  </Button>
{/snippet}

<join-trakt-button>
  <RenderFor audience="public" navigation="default">
    {@render joinButton($url)}
  </RenderFor>

  <RenderFor audience="public" navigation="dpad">
    {@render joinButton(UrlBuilder.login.activate())}
  </RenderFor>
</join-trakt-button>
