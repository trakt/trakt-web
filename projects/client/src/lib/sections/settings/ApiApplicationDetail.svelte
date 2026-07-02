<script lang="ts">
  import { goto } from "$app/navigation";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CopyIcon from "$lib/components/icons/CopyIcon.svelte";
  import EditModeIcon from "$lib/components/icons/EditModeIcon.svelte";
  import VisibilityIcon from "$lib/components/icons/VisibilityIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { onDestroy } from "svelte";
  import ApiApplicationDetailSkeleton from "./_internal/apps/ApiApplicationDetailSkeleton.svelte";
  import DeleteApiApplicationButton from "./_internal/apps/DeleteApiApplicationButton.svelte";
  import { useApiApplication } from "./_internal/apps/useApiApplication.ts";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";

  const { appId }: { appId: number } = $props();

  function handleDeleted() {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(UrlBuilder.settings.appsApi());
  }

  const appId$ = fromRune(() => appId);
  const { app: app$, isLoading: isLoading$ } = useApiApplication(appId$);
  const app = $derived($app$);

  const COPIED_RESET_MS = 1500;
  const SECRET_MASK = "•".repeat(24);

  type CredentialField = {
    key: string;
    label: string;
    value: string;
    isSecret: boolean;
  };

  const fields = $derived<CredentialField[]>(
    app
      ? [
          {
            key: "client-id",
            label: m.label_app_client_id(),
            value: app.clientId,
            isSecret: false,
          },
          {
            key: "client-secret",
            label: m.label_app_client_secret(),
            value: app.clientSecret,
            isSecret: true,
          },
          {
            key: "redirect-uri",
            label: m.label_app_redirect_uri(),
            value: app.redirectUris.join("\n"),
            isSecret: false,
          },
        ]
      : [],
  );

  type PermissionLabel = { key: string; label: string };

  const permissions = $derived.by<PermissionLabel[]>(() => {
    if (!app) {
      return [];
    }

    const result: PermissionLabel[] = [];
    if (app.permissions.canScrobble) {
      result.push({
        key: "scrobble",
        label: m.label_app_permission_scrobble(),
      });
    }
    if (app.permissions.canCheckin) {
      result.push({ key: "checkin", label: m.label_app_permission_checkin() });
    }
    if (app.permissions.canCreateAccounts) {
      result.push({
        key: "account-create",
        label: m.label_app_permission_account_create(),
      });
    }
    return result;
  });

  const createdOn = $derived(
    app ? toHumanDate(new Date(), app.createdAt, getLocale()) : "",
  );

  let isSecretRevealed = $state(false);
  let copiedKey = $state<string | null>(null);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  async function handleCopy(field: CredentialField) {
    const copied = await copyToClipboard(field.value)
      .then(() => true)
      .catch(() => false);

    if (!copied) {
      return;
    }

    copiedKey = field.key;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copiedKey = null), COPIED_RESET_MS);
  }

  onDestroy(() => clearTimeout(resetTimer));
</script>

{#snippet credentialField(field: CredentialField)}
  {@const isHidden = field.isSecret && !isSecretRevealed}
  <div class="field">
    <span class="secondary small">{field.label}</span>
    <div class="value-row">
      <code class="value small" class:masked={isHidden}>
        {#if isHidden}
          {SECRET_MASK}
        {:else}
          {#each field.value.split("\n") as line, index (index)}
            <span class="value-line">{line}</span>
          {/each}
        {/if}
      </code>
      <div class="actions">
        {#if field.isSecret}
          <ActionButton
            style="ghost"
            size="small"
            label={isSecretRevealed
              ? m.button_label_hide_secret()
              : m.button_label_reveal_secret()}
            onclick={() => (isSecretRevealed = !isSecretRevealed)}
          >
            <VisibilityIcon state={isSecretRevealed ? "visible" : "hidden"} />
          </ActionButton>
        {/if}
        <ActionButton
          style="ghost"
          size="small"
          label={copiedKey === field.key
            ? m.button_label_copied()
            : m.button_label_copy()}
          onclick={() => handleCopy(field)}
        >
          {#if copiedKey === field.key}
            <span class="copied-icon"><CheckIcon /></span>
          {:else}
            <CopyIcon />
          {/if}
        </ActionButton>
      </div>
    </div>
  </div>
{/snippet}

{#if app}
  <SettingsGroupCard
    title={app.name}
    description={app.description ?? ""}
    crumb={{
      href: UrlBuilder.settings.appsApi(),
      label: m.heading_api_applications(),
    }}
  >
    {#snippet action()}
      <ActionButton
        href={UrlBuilder.settings.appsApiEdit(app.id)}
        style="ghost"
        color="default"
        size="small"
        label={m.button_label_edit_app({ name: app.name })}
      >
        <EditModeIcon />
      </ActionButton>

      <DeleteApiApplicationButton {app} onDeleted={handleDeleted} />
    {/snippet}

    <div class="detail-body">
          <div class="credentials">
            {#each fields as field (field.key)}
              {@render credentialField(field)}
            {/each}
          </div>

          {#if permissions.length > 0}
            <div class="field">
              <span class="secondary small">
                {m.label_app_permissions()}
              </span>
              <div class="pills">
                {#each permissions as permission (permission.key)}
                  <span class="pill small no-wrap">{permission.label}</span>
                {/each}
              </div>
            </div>
          {/if}

          <p class="secondary small">
            {m.text_app_created_on({ date: createdOn })}
          </p>
        </div>
    </SettingsGroupCard>
{:else if $isLoading$}
  <ApiApplicationDetailSkeleton />
{/if}

<style lang="scss">
  .detail-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    padding: var(--gap-m);
  }

  .credentials {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }

  .value-row {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .value {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    &.masked {
      letter-spacing: var(--ni-2);
    }
  }

  .value-line {
    min-width: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    gap: var(--gap-m);
  }

  .copied-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--color-link-active);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8);
  }

  .pill {
    display: inline-block;
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-s);

    background-color: color-mix(
      in srgb,
      var(--color-link-active) 14%,
      transparent
    );
    color: var(--color-link-active);
  }
</style>
