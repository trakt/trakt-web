import * as m from '$lib/features/i18n/messages.ts';
import type { ConfirmationOperation } from '../models/ConfirmationOperation.ts';
import type { ConfirmationParams } from '../models/ConfirmationParams.ts';
import { ConfirmationType } from '../models/ConfirmationType.ts';
import { getWarningMessage } from './getWarningMessage.ts';

type Confirmation = {
  title: string;
  message: string | Nil;
  detail?: string;
  buttonText: string;
  operation: ConfirmationOperation;
};

export function mapToConfirmation<T extends ConfirmationType>(
  props: ConfirmationParams<T>,
): Confirmation {
  switch (props.type) {
    case ConfirmationType.MarkAsWatched:
      return {
        title: m.confirmation_title_mark_as_watched(),
        buttonText: m.button_text_mark_as_watched(),
        message: getWarningMessage(props.title, props.target),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFromWatched:
      return {
        title: m.confirmation_title_remove_from_watched(),
        buttonText: m.button_text_remove_from_history(),
        message: m.warning_prompt_remove_from_watched({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFromHistory:
      return {
        title: m.confirmation_title_remove_play(),
        buttonText: m.button_text_remove_from_history(),
        message: m.warning_prompt_remove_single_watched({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.DropShow:
      return {
        title: m.confirmation_title_drop_show(),
        buttonText: m.button_text_drop_show(),
        message: m.warning_prompt_drop_show({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.DropMovie:
      return {
        title: m.confirmation_title_drop_movie(),
        buttonText: m.button_text_drop_movie(),
        message: m.warning_prompt_drop_movie({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RestoreShow:
      return {
        title: m.confirmation_title_restore_show(),
        buttonText: m.button_text_restore_show(),
        message: m.warning_prompt_restore_show({ title: props.title }),
        operation: 'affirmative',
      };
    case ConfirmationType.DeleteList:
      return {
        title: m.confirmation_title_delete_list(),
        buttonText: m.button_text_delete_list(),
        message: m.warning_prompt_delete_list({ name: props.name }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFavorite:
      return {
        title: m.confirmation_title_remove_favorite(),
        buttonText: m.button_text_remove_from_favorites(),
        message: m.warning_prompt_remove_from_favorites({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFromWatchList:
      return {
        title: m.confirmation_title_remove_from_watchlist(),
        buttonText: m.button_text_remove_from_watchlist(),
        message: m.warning_prompt_remove_from_watchlist({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFromList:
      return {
        title: m.confirmation_title_remove_from_list(),
        buttonText: m.button_text_remove_from_list(),
        message: m.warning_prompt_remove_from_personal_list({
          list: props.name,
          title: props.title,
        }),
        operation: 'destructive',
      };
    case ConfirmationType.UnfollowUser:
      return {
        title: m.confirmation_title_unfollow_user(),
        buttonText: m.button_text_unfollow(),
        message: m.warning_prompt_unfollow_user({ username: props.username }),
        operation: 'destructive',
      };
    case ConfirmationType.BlockUser:
      return {
        title: m.confirmation_title_block_user(),
        buttonText: m.button_text_block(),
        message: m.warning_prompt_block_user({ username: props.username }),
        detail: m.warning_prompt_block_user_detail(),
        operation: 'destructive',
      };
    case ConfirmationType.StopCheckin:
      return {
        title: m.confirmation_title_stop_checkin(),
        buttonText: m.button_text_stop_check_in(),
        message: m.warning_prompt_stop_checkin({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.DeleteComment:
      return {
        title: m.confirmation_title_delete_comment(),
        buttonText: m.button_text_delete_comment(),
        message: m.warning_prompt_delete_comment(),
        operation: 'destructive',
      };
    case ConfirmationType.DeleteNote:
      return {
        title: m.confirmation_title_delete_note(),
        buttonText: m.button_text_delete_note(),
        message: m.warning_prompt_delete_note(),
        operation: 'destructive',
      };
    case ConfirmationType.SuppressRatingsToast:
      return {
        title: m.confirmation_title_suppress_ratings_toast(),
        buttonText: m.button_text_stop_asking(),
        message: m.warning_prompt_suppress_ratings_toast(),
        operation: 'destructive',
      };
    case ConfirmationType.Logout:
      return {
        title: m.confirmation_title_log_out(),
        buttonText: m.button_text_logout(),
        message: m.warning_prompt_log_out(),
        operation: 'destructive',
      };
    case ConfirmationType.SimpleFilters:
      return {
        title: m.confirmation_title_reset_filters(),
        buttonText: m.button_text_reset_all_filters(),
        message: m.warning_prompt_simple_filters(),
        operation: 'destructive',
      };
    case ConfirmationType.CancelVip:
      return {
        title: m.confirmation_title_cancel_vip(),
        buttonText: m.button_text_cancel_vip(),
        message: m.warning_prompt_cancel_vip(),
        operation: 'destructive',
      };
    case ConfirmationType.CancelImport:
      return {
        title: m.confirmation_title_cancel_import(),
        buttonText: m.button_text_cancel_import(),
        message: m.warning_prompt_cancel_import(),
        operation: 'destructive',
      };
    case ConfirmationType.CancelClear:
      return {
        title: m.confirmation_title_stop_clear(),
        buttonText: m.button_text_stop_clear(),
        message: m.warning_prompt_cancel_clear(),
        operation: 'destructive',
      };
    case ConfirmationType.ClearData:
      return {
        title: m.confirmation_title_clear_data(),
        buttonText: m.button_text_clear_now(),
        message: m.warning_prompt_clear_data({ source: props.sourceText }),
        operation: 'destructive',
      };
    case ConfirmationType.HideRecommendation:
      return {
        title: m.confirmation_title_hide_recommendation(),
        buttonText: m.button_text_hide_recommendation(),
        message: m.warning_prompt_hide_recommendation({ title: props.title }),
        operation: 'destructive',
      };
  }
}
