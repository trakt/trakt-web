<script lang="ts">
  import FormInput from "$lib/components/form/FormInput.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SyncLoadError from "../SyncLoadError.svelte";
  import type { JellyfinSignInDraft } from "./models/JellyfinSignInDraft.ts";
  import { toJellyfinErrorText } from "./toJellyfinErrorText.ts";

  const {
    draft,
    error,
    isSubmitting,
    onChange,
    onSubmit,
  }: {
    draft: JellyfinSignInDraft;
    error: string | null;
    isSubmitting: boolean;
    onChange: (draft: JellyfinSignInDraft) => void;
    onSubmit: () => void;
  } = $props();
</script>

{#snippet quickConnect()}
  <p class="secondary">{m.description_jellyfin_quick_connect()}</p>
{/snippet}

{#snippet password()}
  <p class="secondary">{m.description_jellyfin_password()}</p>
{/snippet}

<form
  class="trakt-jellyfin-sign-in"
  novalidate
  onsubmit={(event) => {
    event.preventDefault();
    onSubmit();
  }}
>
  <div class="server">
    <label class="field">
      <span class="small bold">{m.label_jellyfin_server_url()}</span>
      <FormInput
        type="url"
        value={draft.serverUrl}
        autocomplete="url"
        autofocus
        placeholder={m.input_placeholder_jellyfin_server_url()}
        disabled={isSubmitting}
        onChange={(serverUrl) => onChange({ ...draft, serverUrl })}
      />
    </label>
    <p class="small secondary">{m.hint_jellyfin_server_url()}</p>
  </div>

  <TabView
    value={draft.method}
    onChange={(method) =>
      onChange({ ...draft, method: method as JellyfinSignInDraft["method"] })}
    tabs={[
      {
        value: "quick-connect",
        label: m.tab_text_jellyfin_quick_connect(),
        content: quickConnect,
      },
      {
        value: "password",
        label: m.tab_text_jellyfin_password(),
        content: password,
      },
    ]}
  />

  {#if draft.method === "password"}
    <div class="credentials">
      <label class="field">
        <span class="small bold">{m.label_jellyfin_username()}</span>
        <FormInput
          value={draft.username}
          autocomplete="username"
          placeholder=""
          disabled={isSubmitting}
          onChange={(username) => onChange({ ...draft, username })}
        />
      </label>
      <label class="field">
        <span class="small bold">{m.label_jellyfin_password()}</span>
        <FormInput
          type="password"
          value={draft.password}
          autocomplete="current-password"
          placeholder=""
          disabled={isSubmitting}
          onChange={(password) => onChange({ ...draft, password })}
        />
      </label>
    </div>
  {/if}

  {#if error}
    <SyncLoadError message={toJellyfinErrorText(error)} />
  {/if}

  <button type="submit" hidden aria-label={m.button_label_jellyfin_sign_in()}></button>

</form>

<style lang="scss">
  .trakt-jellyfin-sign-in,
  .server,
  .credentials {
    display: flex;
    flex-direction: column;
  }

  .trakt-jellyfin-sign-in {
    gap: var(--gap-l);
  }

  .server {
    gap: var(--gap-xs);
  }

  .credentials {
    gap: var(--gap-m);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
