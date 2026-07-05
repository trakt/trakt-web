<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { deleteAccountRequest } from "$lib/requests/queries/users/deleteAccountRequest.ts";
  import { vipSubscriptionQuery } from "$lib/requests/vip/vipSubscriptionQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import { slide } from "svelte/transition";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";

  const { confirm } = useConfirm();
  const { logout } = useAuth();
  const { user } = useUser();

  const vipSubscription = useQuery(vipSubscriptionQuery()).pipe(
    map(($subscription) => $subscription.data),
  );

  // A lifetime membership has nothing to cancel, and an already-cancelled one
  // will lapse on its own, only a live recurring subscription blocks deletion.
  const hasActiveVip = $derived(
    $vipSubscription != null &&
      !$vipSubscription.isCancelled &&
      $vipSubscription.type !== "life",
  );

  let isDeleting = $state(false);
  let hasError = $state(false);

  async function deleteAccount() {
    isDeleting = true;
    hasError = false;

    try {
      const success = await deleteAccountRequest();

      if (!success) {
        isDeleting = false;
        hasError = true;
        return;
      }

      // Deletion revokes the account's authorizations server-side, so the
      // current token is already dead. Log out to clear local state and end the
      // session.
      await logout();
    } catch {
      isDeleting = false;
      hasError = true;
    }
  }
</script>

<SettingsGroupCard title={m.header_delete_account()}>
  {#if hasActiveVip}
    <div
      class="trakt-delete-account-vip-notice"
      transition:slide={{ duration: 150, axis: "y" }}
    >
      <span class="vip-notice-icon"><InfoIcon /></span>
      <p class="vip-notice-text">
        <MessageWithLink
          message={m.notice_delete_account_vip()}
          href={UrlBuilder.vip()}
          target="_self"
          color="inherit"
        />
      </p>
    </div>
  {/if}

  <SettingsGroupRow
    title={m.button_label_delete_account()}
    description={m.description_delete_account()}
    variant="custom"
  >
    {#snippet icon()}<DeleteIcon />{/snippet}

    <Button
      label={m.button_label_delete_account()}
      color="red"
      size="small"
      disabled={isDeleting || $vipSubscription === undefined || hasActiveVip}
      onclick={confirm({
        type: ConfirmationType.DeleteAccount,
        username: $user?.username ?? "",
        onConfirm: deleteAccount,
      })}
    >
      {m.button_text_delete_account()}
    </Button>
  </SettingsGroupRow>

  {#if hasError}
    <p
      class="trakt-delete-account-error small"
      transition:slide={{ duration: 150, axis: "y" }}
    >
      {m.error_text_delete_account()}
    </p>
  {/if}
</SettingsGroupCard>

<style lang="scss">
  .trakt-delete-account-error {
    margin: 0;
    padding: var(--gap-s) var(--gap-m);
    color: var(--red-500);
  }

  .trakt-delete-account-vip-notice {
    display: flex;
    align-items: center;
    /* Match SettingsGroupRow's inline padding + icon gap so the icon and text
       line up vertically with the delete row below. */
    gap: var(--gap-m);

    padding: var(--gap-m);

    color: var(--color-foreground-blue);
    background: var(--color-background-blue);
  }

  .vip-notice-icon {
    flex-shrink: 0;

    /* Same footprint as the row icon container so the text starts at the same
       horizontal position as the row title. */
    width: var(--ni-36);
    display: flex;
    align-items: center;
    justify-content: center;

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .vip-notice-text {
    margin: 0;
  }
</style>
