<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { Snippet } from "svelte";

  const { size, icon }: { size: "small" | "normal"; icon?: Snippet } = $props();

  const { login } = useAuth();
</script>

<join-trakt-button>
  <Button
    label={m.button_label_join_trakt()}
    style="flat"
    color="purple"
    variant="primary"
    navigationType={DpadNavigationType.Item}
    {size}
    {icon}
    onclick={login}
  >
    {m.button_text_join_trakt()}
  </Button>
</join-trakt-button>

<style>
  join-trakt-button {
    :global(.button-icon svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }
</style>
