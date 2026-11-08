import * as m from '$lib/features/i18n/messages.ts';
import ApiIcon from './icons/ApiIcon.svelte';
import BookmarkIcon from './icons/BookmarkIcon.svelte';
import ChatIcon from './icons/ChatIcon.svelte';
import GlobeIcon from './icons/GlobeIcon.svelte';
import LibraryIcon from './icons/LibraryIcon.svelte';
import ListIcon from './icons/ListIcon.svelte';
import RecapsIcon from './icons/RecapsIcon.svelte';
import SentimentIcon from './icons/SentimentIcon.svelte';
import StreamingIcon from './icons/StreamingIcon.svelte';
import SyncIcon from './icons/SyncIcon.svelte';

export const VIP_FEATURES = [
  {
    title: m.vip_feature_title_recaps,
    description: m.vip_feature_description_recaps,
    icon: RecapsIcon,
  },
  {
    title: m.vip_feature_title_global_wtw,
    description: m.vip_feature_description_global_wtw,
    icon: GlobeIcon,
  },
  {
    title: m.vip_feature_title_bigger_watchlist,
    description: m.vip_feature_description_bigger_watchlist,
    icon: BookmarkIcon,
  },
  {
    title: m.vip_feature_title_bigger_library,
    description: m.vip_feature_description_bigger_library,
    icon: LibraryIcon,
  },
  {
    title: m.vip_feature_title_plex_sync,
    description: m.vip_feature_description_plex_sync,
    icon: SyncIcon,
  },
  {
    title: m.vip_feature_title_streaming_services,
    description: m.vip_feature_description_streaming_services,
    icon: StreamingIcon,
  },
  {
    title: m.vip_feature_title_more_lists,
    description: m.vip_feature_description_more_lists,
    icon: ListIcon,
  },
  {
    title: m.vip_feature_title_sentiment_trivia,
    description: m.vip_feature_description_sentiment_trivia,
    icon: SentimentIcon,
  },
  {
    title: m.vip_feature_title_api_apps,
    description: m.vip_feature_description_api_apps,
    icon: ApiIcon,
  },
  {
    title: m.vip_feature_title_support,
    description: m.vip_feature_description_support,
    icon: ChatIcon,
  },
] as const;
