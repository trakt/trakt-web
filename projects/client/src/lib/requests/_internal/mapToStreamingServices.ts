import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { WatchNowResponse, WatchNowServiceResponse } from '@trakt/api';
import type {
  StreamingServiceOptions,
  StreamNow,
  StreamOnDemand,
} from '../models/StreamingServiceOptions.ts';
import { sortStreamingServices } from './sortStreamingServices.ts';

function mapToStreamNow(
  serviceResponse: WatchNowServiceResponse,
): StreamNow {
  // FIXME move this to the API
  const webOSLink = serviceResponse.link_webos &&
      serviceResponse.link_webos.params.contentTarget !== ''
    ? {
      id: serviceResponse.link_webos.id,
      contentTarget: serviceResponse.link_webos.params.contentTarget,
    }
    : undefined;

  return {
    type: 'streaming',
    link: prependHttps(serviceResponse.link),
    source: serviceResponse.source,
    is4k: serviceResponse.uhd,
    webOSLink,
  };
}

function mapToStreamOnDemand(
  serviceResponse: WatchNowServiceResponse,
): StreamOnDemand {
  const getPrice = (price: string | Nil) => {
    if (!price) {
      return undefined;
    }

    return parseFloat(price);
  };

  return {
    type: 'on-demand',
    link: prependHttps(serviceResponse.link),
    deepLink: serviceResponse.link_direct,
    source: serviceResponse.source,
    is4k: serviceResponse.uhd,
    currency: serviceResponse.currency,
    prices: {
      rent: getPrice(serviceResponse.prices.rent),
      purchase: getPrice(serviceResponse.prices.purchase),
    },
  };
}

export function mapToStreamingServices(
  response: WatchNowResponse,
  country: string,
): StreamingServiceOptions {
  const data = response[country];

  const subscriptionResponse = sortStreamingServices(data?.subscription ?? []);
  const purchaseResponse = sortStreamingServices(data?.purchase ?? []);

  return {
    streaming: subscriptionResponse.map(mapToStreamNow),
    onDemand: purchaseResponse.map(mapToStreamOnDemand),
  };
}
