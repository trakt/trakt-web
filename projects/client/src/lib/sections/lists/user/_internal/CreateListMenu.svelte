<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BrainIcon from "$lib/components/icons/BrainIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useVipUpsell } from "$lib/features/upsell/useVipUpsell";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SaveListDrawer from "./SaveListDrawer.svelte";

  const { user } = useUser();
  const { lists, isLoading } = useAllPersonalLists();
  const { trackClick, trackImpression } = useVipUpsell(() => "lists");

  const isAtLimit = $derived(
    !$isLoading && $lists.length >= $user.limits.lists.limit,
  );

  let showCreateList = $state(false);
</script>

{#snippet plusIcon()}
  <PlusIcon />
{/snippet}

<PopupMenu
  title={m.button_label_create_list()}
  label={m.button_label_create_list()}
  mode="standalone"
  icon={plusIcon}
  disabled={$isLoading}
>
  {#snippet items()}
    <DropdownItem
      href={UrlBuilder.lists.smart.create()}
      label={m.list_title_smart_lists()}
    >
      {m.button_text_smart_lists()}

      {#snippet icon()}
        <BrainIcon />
      {/snippet}
    </DropdownItem>

    {#if isAtLimit}
      <DropdownItem
        href={UrlBuilder.vip("lists")}
        label={m.link_label_get_vip()}
        onclick={trackClick}
      >
        <span use:trackImpression>{m.button_text_personal()}</span>

        {#snippet icon()}
          <ProfileIcon />
        {/snippet}

        {#snippet subtitle()}
          {m.link_text_vip_list_upsell()}
        {/snippet}
      </DropdownItem>
    {:else}
      <DropdownItem
        label={m.list_title_personal_lists()}
        onclick={() => (showCreateList = true)}
      >
        {m.button_text_personal()}

        {#snippet icon()}
          <ProfileIcon />
        {/snippet}
      </DropdownItem>
    {/if}
  {/snippet}
</PopupMenu>

{#if showCreateList}
  <SaveListDrawer type="create" onClose={() => (showCreateList = false)} />
{/if}
