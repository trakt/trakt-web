import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import { YirPersonaIdSchema } from '$lib/requests/models/YirPersonaId.ts';
import { yirPersonaQuery } from '$lib/requests/queries/users/yirPersonaQuery.ts';
import YirShareCard from '$lib/sections/yir/2026/YirShareCard.svelte';
import { toYirShareData } from '$lib/sections/yir/2026/toYirShareData.ts';
import { yirShareCardWidth } from '$lib/sections/yir/2026/yirShareCardWidth.ts';
import { loadSystemFont } from '$test/beds/font/loadSystemFont.ts';
import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderShareCard } from '../../_internal/renderShareCard.ts';
import { resolveContainerUnits } from './resolveContainerUnits.ts';

const user = {
  name: 'Sean Rivera',
  username: 'sean',
  avatarUrl: null,
  isVip: true,
  badgeLabel: 'VIP',
};

function complaints(
  calls: ReadonlyArray<ReadonlyArray<unknown>>,
): ReadonlyArray<string> {
  return calls
    .map((args) => args.map(String).join(' '))
    .filter((message) => !message.startsWith('[MSW]'));
}

async function toCardHtml({
  persona,
  variant,
}: {
  persona: (typeof YirPersonaIdSchema.options)[number];
  variant: ShareType;
}) {
  const result = await yirPersonaQuery({
    slug: 'sean',
    year: 2026,
    preview: { persona },
  }).execute();

  if (!result) throw new Error(`No preview result for ${persona}`);

  const { container } = render(YirShareCard, {
    props: { data: toYirShareData({ result, user, year: 2026 }), variant },
  });

  const styles = Array.from(document.head.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('');

  return resolveContainerUnits({
    html: `${container.innerHTML}<style>${styles}</style>`,
    width: yirShareCardWidth(variant),
  });
}

describe.skipIf(!process.env.CI)(
  'component: YirShareCard through takumi',
  () => {
    afterEach(() => {
      cleanup();
      vi.restoreAllMocks();
    });

    const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

    for (const persona of YirPersonaIdSchema.options) {
      for (const variant of variants) {
        it(`should render ${persona} as ${variant} without complaints`, async () => {
          const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
          const error = vi.spyOn(console, 'error').mockImplementation(() => {});

          const jpeg = await renderShareCard({
            html: await toCardHtml({ persona, variant }),
            variant,
            fonts: [
              {
                name: 'Inter',
                data: new Uint8Array(loadSystemFont()).buffer,
                weight: 400,
                style: 'normal',
              },
            ],
            images: [],
          });

          expect([...jpeg.slice(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
          expect(complaints(warn.mock.calls)).toEqual([]);
          expect(complaints(error.mock.calls)).toEqual([]);
        });
      }
    }
  },
);
