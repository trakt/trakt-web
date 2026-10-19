import {
  type VipFlow,
  VipFlowSchema,
} from '$lib/features/upsell/models/VipFlow.ts';
import type { VipUpsellSource } from '$lib/features/upsell/models/VipUpsellSource.ts';
import { toVipUpsellSource } from '$lib/features/upsell/toVipUpsellSource.ts';
import {
  type VipPlanDuration,
  VipPlanDurationSchema,
} from '$lib/requests/models/VipPlanDuration.ts';

const FLOW_BY_PATH: Readonly<Record<string, VipFlow>> = {
  '/vip/renew': 'renew',
  '/vip/cancel': 'switch',
};
const CANCELED = 'canceled';

type VipParams = {
  source: VipUpsellSource;
  plan: VipPlanDuration | null;
  flow: VipFlow;
  checkout: typeof CANCELED | null;
};

function toFlow({
  pathname,
  searchParams,
}: Pick<URL, 'pathname' | 'searchParams'>) {
  const flow = VipFlowSchema.safeParse(searchParams.get('flow'));
  if (flow.success) return flow.data;

  return FLOW_BY_PATH[pathname.replace(/\/$/, '')] ?? 'new';
}

export function parseVipParams(
  url: Pick<URL, 'pathname' | 'searchParams'>,
): VipParams {
  const { searchParams } = url;
  const plan = VipPlanDurationSchema.safeParse(searchParams.get('plan'));

  return {
    source: toVipUpsellSource(searchParams.get('source')),
    plan: plan.success ? plan.data : null,
    flow: toFlow(url),
    checkout: searchParams.get('checkout') === CANCELED ? CANCELED : null,
  };
}
