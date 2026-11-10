import type { SelectOption } from '../models/SelectOption.ts';

type OptionSection = {
  key: string;
  label?: string;
  options: ReadonlyArray<SelectOption>;
};

const toSectionKey = (option: SelectOption) =>
  option.group ? `group:${option.group.key}` : `option:${option.value}`;

export function toOptionSections(
  options: ReadonlyArray<SelectOption>,
): ReadonlyArray<OptionSection> {
  return options.reduce<OptionSection[]>((sections, option) => {
    const last = sections.at(-1);
    const isSameGroup =
      option.group != null && last?.key === toSectionKey(option);

    if (isSameGroup) {
      return [
        ...sections.slice(0, -1),
        { ...last, options: [...last.options, option] },
      ];
    }

    return [
      ...sections,
      {
        key: toSectionKey(option),
        label: option.group?.label,
        options: [option],
      },
    ];
  }, []);
}
