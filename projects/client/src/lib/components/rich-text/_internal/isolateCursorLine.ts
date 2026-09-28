import type { CommandProps } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';

function hardBreakOffsets(parent: Node): ReadonlyArray<number> {
  const offsets: Array<number> = [];

  parent.forEach((node, offset) => {
    if (node.type.name === 'hardBreak') offsets.push(offset);
  });

  return offsets;
}

export function isolateCursorLine({ tr, dispatch }: CommandProps): boolean {
  const { $from, empty } = tr.selection;
  if (!empty || $from.depth !== 1) return true;
  if (!dispatch) return true;

  const offsets = hardBreakOffsets($from.parent);
  const before = offsets.findLast((offset) => offset < $from.parentOffset);
  const after = offsets.find((offset) => offset >= $from.parentOffset);
  const start = $from.start();

  [after, before]
    .filter((offset) => offset != null)
    .forEach((offset) => {
      const position = start + offset;
      tr.delete(position, position + 1).split(position);
    });

  return true;
}
