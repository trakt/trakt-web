import { attachAll } from './attachAll.ts';
import { injectDecoration } from './injectDecoration.ts';

type AttachDecorationParams = {
  selector: string;
  className: string;
  markup?: string;
  prepend?: boolean;
};

export function attachDecoration({
  selector,
  className,
  markup,
  prepend,
}: AttachDecorationParams) {
  return attachAll({
    selector,
    attach: (host) => injectDecoration({ host, className, markup, prepend }),
  });
}
