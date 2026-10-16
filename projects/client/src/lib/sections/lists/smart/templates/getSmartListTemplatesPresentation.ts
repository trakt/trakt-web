type SmartListTemplatesPresentation = 'strip' | 'link';

type SmartListTemplatesPresentationProps = {
  listCount: number;
  isHidden: boolean;
};

export function getSmartListTemplatesPresentation(
  { listCount, isHidden }: SmartListTemplatesPresentationProps,
): SmartListTemplatesPresentation {
  return listCount === 0 && !isHidden ? 'strip' : 'link';
}
