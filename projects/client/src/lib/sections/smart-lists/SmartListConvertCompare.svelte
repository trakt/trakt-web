<script lang="ts">
  import { goto } from "$app/navigation";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { SmartListDraft } from "$lib/requests/models/SmartListDraft.ts";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import SmartListDraftPreview from "./_internal/SmartListDraftPreview.svelte";
  import { toSmartListDraftChips } from "./toSmartListDraftChips.ts";
  import { useConvertSmartList } from "./useConvertSmartList.ts";
  import { useSmartListDraft } from "./useSmartListDraft.ts";

  type CompareView = "current" | "proposed";

  const { slug }: { slug: string } = $props();

  const listId = untrack(() => slug);
  const { list, isLoading: isListLoading } = useUserListSummary({
    userId: "me",
    listId,
  });
  const { draft, isLoading: isDraftLoading } = useSmartListDraft({
    userId: "me",
    listId,
  });
  const { convertList, isConverting } = useConvertSmartList();
  const { notify } = useActionToast();

  let view = $state<CompareView>("proposed");

  const listUrl = UrlBuilder.users("me").lists(listId);
  const isMissing = $derived(
    !$isListLoading && !$isDraftLoading && (!$list || !$draft),
  );

  const draftSummary = $derived(
    $draft ? toSmartListDraftChips($draft).join(" · ") : undefined,
  );

  const viewOptions = $derived([
    { value: "current" as const, text: m.header_smart_list_compare_current() },
    {
      value: "proposed" as const,
      text: m.header_smart_list_compare_proposed(),
    },
  ]);

  const onCancel = () => goto(listUrl, { replaceState: true });

  const onConvert = async (current: MediaListSummary, proposed: SmartListDraft) => {
    const smartSlug = await convertList({
      listId,
      name: current.name,
      draft: proposed,
    });

    if (!smartSlug) {
      notify({ message: m.action_toast_action_failed(), variant: "error" });
      return;
    }

    goto(UrlBuilder.lists.smart.view(smartSlug), { replaceState: true });
  };
</script>

{#snippet actions()}
  {#if $list && $draft}
    {@const current = $list}
    {@const proposed = $draft}
    <div class="trakt-smart-list-convert-actions">
      <Button
        size="small"
        variant="secondary"
        color="default"
        label={m.button_label_cancel()}
        disabled={$isConverting}
        onclick={onCancel}
      >
        {m.button_text_cancel()}
      </Button>
      <Button
        size="small"
        color="purple"
        label={m.button_label_smart_list_convert()}
        disabled={$isConverting}
        onclick={() => onConvert(current, proposed)}
      >
        {m.button_text_smart_list_convert()}
      </Button>
    </div>
  {/if}
{/snippet}

{#snippet headerActions()}
  <RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
    {@render actions()}
  </RenderFor>
{/snippet}

<NavbarStateSetter
  showFilters={false}
  {headerActions}
  header={{
    title: $list?.name ?? "",
    metaInfo: draftSummary,
  }}
/>

{#if isMissing}
  <Redirect to={listUrl} />
{:else if $list && $draft}
  <div class="trakt-smart-list-convert-compare" data-view={view}>
    <RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
      <div class="compare-mobile-actions">
        {@render actions()}
      </div>
    </RenderFor>

    <div class="compare-toggle">
      <SegmentedSelect
        value={view}
        options={viewOptions}
        onChange={(value) => (view = value)}
        ariaLabel={m.label_smart_list_compare_view()}
        fill
      />
    </div>

    <GlobalParameterEscaper enabled>
      <section class="compare-column" data-column="current">
        <UserListPaginatedList
          title={m.header_smart_list_compare_current()}
          list={$list}
          type="media"
          sortBy={undefined}
          sortHow={$list.sortHow}
        />
      </section>

      <section class="compare-column" data-column="proposed">
        <SmartListDraftPreview
          {listId}
          draft={$draft}
          title={m.header_smart_list_compare_proposed()}
        />
      </section>
    </GlobalParameterEscaper>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-convert-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-smart-list-convert-compare {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-l);

    .compare-toggle {
      display: none;
    }

    .compare-mobile-actions {
      padding-inline: var(--layout-distance-side);

      .trakt-smart-list-convert-actions {
        justify-content: end;
      }
    }

    .compare-column {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);

      min-width: 0;
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--gap-m);

      .compare-toggle {
        display: block;
        padding-inline: var(--layout-distance-side);
      }

      &[data-view="current"] .compare-column[data-column="proposed"],
      &[data-view="proposed"] .compare-column[data-column="current"] {
        display: none;
      }
    }
  }
</style>
