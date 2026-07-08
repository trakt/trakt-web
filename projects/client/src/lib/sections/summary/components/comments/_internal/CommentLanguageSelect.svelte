<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import { availableLocales, getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { COMMENT_LANGUAGE_ALL } from "./commentLanguageAll.ts";
  import type { CommentLanguageSelectProps } from "./CommentLanguageSelectProps.ts";

  const { value, onChange }: CommentLanguageSelectProps = $props();

  const options = $derived.by(() => {
    const currentLocale = getLocale();
    const displayNames = new Intl.DisplayNames([currentLocale], {
      type: "language",
    });
    const collator = new Intl.Collator(currentLocale, { sensitivity: "base" });

    const languageOptions = [
      ...new Set(
        availableLocales.map((locale) => locale.split("-").at(0) ?? locale),
      ),
    ]
      .map((code) => ({
        value: code,
        label: displayNames.of(code) ?? code,
      }))
      .sort((a, b) => collator.compare(a.label, b.label));

    return [
      {
        value: COMMENT_LANGUAGE_ALL,
        label: m.option_text_comment_language_all(),
      },
      ...languageOptions,
    ];
  });
</script>

<SingleSelect
  {options}
  {value}
  placeholder={m.header_language()}
  {onChange}
  autoWidth
>
  {#snippet trigger({ props })}
    <ActionButton {...props} label={m.header_language()} style="ghost">
      <GlobeIcon />
    </ActionButton>
  {/snippet}
</SingleSelect>
