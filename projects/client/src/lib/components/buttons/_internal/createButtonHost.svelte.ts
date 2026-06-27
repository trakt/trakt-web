import { appendGlobalParameters } from '$lib/features/parameters/appendGlobalParameters.ts';
import { triggerWithKeyboard } from '$lib/utils/actions/triggerWithKeyboard.ts';
import { Button } from 'bits-ui';
import type { Attachment } from 'svelte/attachments';
import { createAttachmentKey } from 'svelte/attachments';

// A Svelte action invoked node-only; its `destroy` becomes the attachment
// cleanup. bits-ui's Button.Root exposes no `child` snippet, so `use:` directives
// can't reach the rendered element — actions are forwarded as attachments.
type ButtonAction = (node: HTMLElement) => { destroy?: () => void } | void;

function toAttachment(run: ButtonAction): Attachment<HTMLElement> {
  return (node) => run(node)?.destroy;
}

type ButtonHostConfig = {
  /** The remaining `...props` bag to spread onto the element. */
  getProps: () => Record<string, unknown>;
  /** The guarded, resolved href (anchor when present, button otherwise). */
  getHref: () => string | Nil;
  getDisabled: () => boolean | undefined;
  /** Full class string, including any `trakt-link-active` state. */
  getClassName: () => string;
  /** Component-owned attributes (aria-label, data-variant, …). */
  getAttrs: () => Record<string, unknown>;
  getNoscroll: () => boolean | undefined;
  getReplacestate: () => boolean | undefined;
  /** Non-anchor actions a component always wants (e.g. clickOutside). */
  commonActions?: ButtonAction[];
};

export function createButtonHost(config: ButtonHostConfig) {
  // Re-created only when href changes, so unrelated prop updates (including
  // disabled toggles) don't tear down and re-attach the actions. bits-ui's
  // Button.Root natively neutralises a disabled element (drops href, sets
  // aria-disabled/tabindex), so no disableNavigation action is needed.
  const attachments = $derived.by(() => {
    const href = config.getHref();
    const runs: ButtonAction[] = [...(config.commonActions ?? [])];

    if (href != null) {
      runs.push(
        (node) => triggerWithKeyboard(node),
        (node) => appendGlobalParameters(node as HTMLAnchorElement, href),
      );
    }

    return Object.fromEntries(
      runs.map((run) => [createAttachmentKey(), toAttachment(run)]),
    );
  });

  // href is replaced by the guarded value; noscroll/replacestate map to
  // data-sveltekit-* attributes, so strip them before spreading the remainder.
  const restProps = $derived.by(() => {
    const {
      href: _href,
      noscroll: _noscroll,
      replacestate: _replacestate,
      ...rest
    } = config.getProps() as Record<string, unknown> & Partial<HTMLAnchorProps>;
    return rest;
  });

  const rootProps = $derived({
    ...restProps,
    ...attachments,
    href: config.getHref() ?? undefined,
    disabled: config.getDisabled() || undefined,
    class: config.getClassName(),
    'data-sveltekit-keepfocus': config.getHref() != null ? '' : undefined,
    'data-sveltekit-noscroll': config.getNoscroll(),
    'data-sveltekit-replacestate': config.getReplacestate(),
    ...config.getAttrs(),
    // bits-ui's Button.Root props are a discriminated union (anchor vs button)
    // that a dynamic href + type can't statically satisfy.
  } as unknown as Button.RootProps);

  return {
    get rootProps() {
      return rootProps;
    },
  };
}
