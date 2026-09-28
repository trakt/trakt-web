import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { Suggestion } from '@tiptap/suggestion';
import type { MentionSuggestionState } from './MentionSuggestionState.ts';

type MentionSuggestionOptions = {
  onChange: (state: MentionSuggestionState | null) => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
};

export const MentionSuggestion = Extension.create<MentionSuggestionOptions>({
  name: 'mentionSuggestion',

  addProseMirrorPlugins() {
    const { onChange, onKeyDown } = this.options;
    const report = ({ query, range }: MentionSuggestionState) =>
      onChange({ query, range });

    return [
      Suggestion({
        editor: this.editor,
        pluginKey: new PluginKey('mentionSuggestion'),
        char: '@',
        allowSpaces: true,
        command: () => undefined,
        render: () => ({
          onStart: report,
          onUpdate: report,
          onExit: () => onChange(null),
          onKeyDown: ({ event }) => onKeyDown(event),
        }),
      }),
    ];
  },
});
