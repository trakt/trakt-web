import type { WatchNowResponse, WatchNowServiceResponse } from '$lib/api.ts';
import type {
  WatchNowOnDemand,
  WatchNowService,
  WatchNowServices,
} from '../models/WatchNowServices.ts';
import { sortWatchNowSources } from './sortWatchNowSources.ts';

function mapStreamingService(
  serviceResponse: WatchNowServiceResponse,
): WatchNowService {
  return {
    type: 'streaming',
    link: `https://${serviceResponse.link}`,
    source: serviceResponse.source,
    is4k: serviceResponse.uhd,
  };
}

function mapOnDemandService(
  serviceResponse: WatchNowServiceResponse,
): WatchNowOnDemand {
  const getPrice = (price: string | Nil) => {
    if (!price) {
      return undefined;
    }

    return parseFloat(price);
  };

  return {
    type: 'on-demand',
    link: `https://${serviceResponse.link}`,
    source: serviceResponse.source,
    is4k: serviceResponse.uhd,
    currency: serviceResponse.currency,
    prices: {
      rent: getPrice(serviceResponse.prices.rent),
      purchase: getPrice(serviceResponse.prices.purchase),
    },
  };
}

export function mapWatchNowResponseToWatchNowDetails(
  response: WatchNowResponse,
  country: string,
): WatchNowServices {
  const data = response[country];

  const subscriptionResponse = sortWatchNowSources(data?.subscription ?? []);
  const purchaseResponse = sortWatchNowSources(data?.purchase ?? []);

  return {
    streamingServices: subscriptionResponse.map(mapStreamingService),
    onDemandServices: purchaseResponse.map(mapOnDemandService),
  };
}
