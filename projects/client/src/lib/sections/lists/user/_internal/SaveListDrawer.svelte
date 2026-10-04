<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import SortDirectionIcon from "$lib/components/icons/SortDirectionIcon.svelte";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListPrivacy } from "$lib/requests/models/ListPrivacy";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { iffy } from "$lib/utils/function/iffy";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { WATCHLIST_SORT_OPTIONS } from "../constants/index.ts";
  import type { SortDirection } from "../models/SortDirection.ts";
  import { useCloneList } from "./useCloneList";
  import { useSaveList } from "./useSaveList";

  // FIXME: remove when we properly deal with other privacy options
  const SUPPORTED_PRIVACY: ListPrivacy[] = ["public", "private"];

  type CreateListProps = {
    type: "create";
  };

  type UpdateListProps = {
    type: "update";
    list: MediaListSummary;
  };

  type CloneListProps = {
    type: "clone";
    list: MediaListSummary;
  };

  type SaveListDrawerProps = {
    onClose: () => void;
  } & (CreateListProps | UpdateListProps | CloneListProps);

  const { onClose, ...props }: SaveListDrawerProps = $props();

  const isOpen = writable(true);

  const { user } = useUser();

  const ownPrivacy = $derived(
    ($user?.isPrivate ? "private" : "public") as ListPrivacy,
  );

  const defaultValues = iffy(() => {
    if (props.type === "create") {
      return {
        name: "",
        description: "",
        privacy: ownPrivacy,
        sortBy: undefined as string | undefined,
        sortHow: undefined as SortDirection | undefined,
      };
    }

    if (props.type === "clone") {
      return {
        name: m.text_cloned_list_name({ name: props.list.name }),
        description: props.list.description,
        privacy: ownPrivacy,
        sortBy: undefined as string | undefined,
        sortHow: undefined as SortDirection | undefined,
      };
    }

    return {
      name: props.list.name,
      description: props.list.description,
      privacy: props.list.privacy,
      sortBy: props.list.sortBy,
      sortHow: props.list.sortHow,
    };
  });

  const name = writable(defaultValues.name);
  const description = writable(defaultValues.description);
  const privacy = writable(defaultValues.privacy);
  const sortBy = writable(defaultValues.sortBy);
  const sortHow = writable(defaultValues.sortHow);

  const sortByOptions = $derived(
    WATCHLIST_SORT_OPTIONS
      .filter((option) => option.value !== undefined)
      .map((option) => ({ value: option.value as string, label: option.text() })),
  );

  const currentSortHow = $derived($sortHow ?? "desc");
  const sortDirectionLabel = $derived(
    currentSortHow === "asc"
      ? m.button_label_sort_ascending()
      : m.button_label_sort_descending(),
  );

  const { saveList, isSaving } = iffy(() => {
    switch (props.type) {
      case "create":
        return useSaveList({ type: "create" });
      case "clone":
        return useCloneList(props.list);
      case "update":
        return useSaveList({ type: "update", listId: props.list.slug });
    }
  });

  const listOwner = $derived(
    props.type === "update" ? props.list.user.slug : undefined,
  );
  const currentListPageOwner = $derived(
    props.type === "update" && listOwner &&
      UrlBuilder.users(listOwner).lists(props.list.slug) === page.url.pathname
      ? listOwner
      : undefined,
  );

  async function handleSubmit() {
    const owner = currentListPageOwner;

    const slug = await saveList({
      name: $name,
      description: $description,
      privacy: $privacy,
      sortBy: $sortBy,
      sortHow: $sortHow,
    });

    if (props.type === "clone" && slug) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      await goto(UrlBuilder.users("me").lists(slug));
    } else if (owner && slug) {
      const target = UrlBuilder.users(owner).lists(slug);

      if (target !== page.url.pathname) {
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        await goto(`${target}${page.url.search}`, { replaceState: true });
      }
    }

    $isOpen && onClose();
  }

  const isDirty = $derived(
    defaultValues.description !== $description ||
      defaultValues.name !== $name ||
      defaultValues.privacy !== $privacy ||
      defaultValues.sortBy !== $sortBy ||
      defaultValues.sortHow !== $sortHow,
  );

  const drawerTitle = $derived.by(() => {
    switch (props.type) {
      case "create":
        return m.page_title_create_list();
      case "clone":
        return m.page_title_clone_list();
      case "update":
        return m.page_title_edit_list();
    }
  });

  const confirmText = $derived.by(() => {
    switch (props.type) {
      case "create":
        return m.button_text_create();
      case "clone":
        return m.button_text_clone();
      case "update":
        return m.button_text_apply();
    }
  });

  const confirmLabel = $derived.by(() => {
    switch (props.type) {
      case "create":
        return m.button_label_create_list();
      case "clone":
        return m.button_label_clone_list({ name: props.list.name });
      case "update":
        return m.button_label_apply();
    }
  });

  /**
   * A clone is submittable as-is - its prefilled values are the copy the user
   * asked for, so it does not have to be edited first.
   */
  const isSubmittable = $derived(
    props.type === "clone" ? $name.trim().length > 0 : isDirty,
  );
</script>

<Drawer
  onClose={() => {
    isOpen.set(false);
    onClose();
  }}
  size="auto"
  title={drawerTitle}
  classList="trakt-save-list-drawer"
>
  {#snippet badge()}
    <div class="trakt-list-privacy-toggle">
      <span class="secondary">{m.text_private()}</span>
      <Switch
        label={m.switch_label_toggle_list_privacy()}
        checked={$privacy === "private"}
        indeterminate={!SUPPORTED_PRIVACY.includes($privacy)}
        onclick={() => {
          privacy.set($privacy === "private" ? "public" : "private");
        }}
      />
    </div>
  {/snippet}

  <Form
    onSubmit={handleSubmit}
    onCancel={onClose}
    disabled={$isSaving || !isSubmittable}
    isCancelDisabled={$isSaving}
    confirmButtonText={confirmText}
    confirmButtonLabel={confirmLabel}
  >
    <div class="trakt-list-properties">
      <FormInput
        placeholder={m.input_placeholder_lists_name()}
        onChange={(value) => name.set(value.trim())}
        disabled={$isSaving}
        value={$name}
        autofocus
        required
        validation={{
          isValid: (value) => value.trim().length > 0,
          errorText: m.validation_text_list_name(),
        }}
      />
      <FormInput
        placeholder={m.input_placeholder_lists_description()}
        onChange={description.set}
        disabled={$isSaving}
        value={$description}
      />
      {#if props.type === "update"}
        <div class="trakt-list-sort-order">
          <span>{m.text_default_sort_order()}</span>
          <div class="sort-order-controls">
            <div class="sort-order-field">
              <SingleSelect
                options={sortByOptions}
                value={$sortBy}
                placeholder={m.text_default_sort_order()}
                disabled={$isSaving}
                autoWidth
                onChange={(value) => sortBy.set(value)}
              />
            </div>
            <ActionButton
              type="button"
              style="flat"
              variant="secondary"
              label={sortDirectionLabel}
              disabled={$isSaving}
              onclick={() =>
                sortHow.set(currentSortHow === "asc" ? "desc" : "asc")}
            >
              <SortDirectionIcon direction={currentSortHow} />
            </ActionButton>
          </div>
        </div>
      {/if}
    </div>
  </Form>
</Drawer>

<style>
  :global(.trakt-save-list-drawer) {
    :global(.trakt-drawer-title-container) {
      flex-grow: 1;
      justify-content: space-between;
    }
  }

  .trakt-list-properties {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-list-sort-order {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    width: 100%;
    margin-block-start: var(--gap-s);

    .sort-order-controls {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: var(--gap-xxs);
      width: 100%;

      .sort-order-field {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
    }
  }

  .trakt-list-privacy-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: var(--gap-xs);
  }
</style>
