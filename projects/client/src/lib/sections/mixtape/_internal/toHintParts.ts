type HintPart = { text: string; isEmphasis: boolean };

type ToHintPartsProps = {
  format: (words: { right: string; left: string }) => string;
  right: string;
  left: string;
};

const RIGHT = '\uE000';
const LEFT = '\uE001';

export function toHintParts(
  { format, right, left }: ToHintPartsProps,
): HintPart[] {
  return format({ right: RIGHT, left: LEFT })
    .split(/([\uE000\uE001])/u)
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part === RIGHT) return { text: right, isEmphasis: true };
      if (part === LEFT) return { text: left, isEmphasis: true };
      return { text: part, isEmphasis: false };
    });
}
