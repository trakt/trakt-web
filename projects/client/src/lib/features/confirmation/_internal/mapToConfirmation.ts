import * as m from '$lib/features/i18n/messages.ts';
import type { ConfirmationOperation } from '../models/ConfirmationOperation.ts';
import type { ConfirmationParams } from '../models/ConfirmationParams.ts';
import { ConfirmationType } from '../models/ConfirmationType.ts';
import { getWarningMessage } from './getWarningMessage.ts';

type Confirmation = {
  message: string | Nil;
  buttonText: string;
  operation: ConfirmationOperation;
};

export function mapToConfirmation<T extends ConfirmationType>(
  props: ConfirmationParams<T>,
): Confirmation {
  switch (props.type) {
    case ConfirmationType.MarkAsWatched:
      return {
        buttonText: m.button_text_mark_as_watched(),
        message: getWarningMessage(props.title, props.target),
        operation: 'affirmative',
      };
    case ConfirmationType.RemoveFromWatched:
      return {
        buttonText: m.button_text_remove_from_history(),
        message: m.warning_prompt_remove_from_watched({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFromHistory:
      return {
        buttonText: m.button_text_remove_from_history(),
        message: m.warning_prompt_remove_single_watched({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.DropShow:
      return {
        buttonText: m.button_text_drop_show(),
        message: m.warning_prompt_drop_show({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.DropMovie:
      return {
        buttonText: m.button_text_drop_movie(),
        message: m.warning_prompt_drop_movie({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RestoreShow:
      return {
        buttonText: m.button_text_restore_show(),
        message: m.warning_prompt_restore_show({ title: props.title }),
        operation: 'affirmative',
      };
    case ConfirmationType.DeleteList:
      return {
        buttonText: m.button_text_delete_list(),
        message: m.warning_prompt_delete_list({ name: props.name }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFavorite:
      return {
        buttonText: m.button_text_remove_from_favorites(),
        message: m.warning_prompt_remove_from_favorites({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFromWatchList:
      return {
        buttonText: m.button_text_remove_from_watchlist(),
        message: m.warning_prompt_remove_from_watchlist({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.RemoveFromList:
      return {
        buttonText: m.button_text_remove_from_list(),
        message: m.warning_prompt_remove_from_personal_list({
          list: props.name,
          title: props.title,
        }),
        operation: 'destructive',
      };
    case ConfirmationType.UnfollowUser:
      return {
        buttonText: m.button_text_unfollow(),
        message: m.warning_prompt_unfollow_user({ username: props.username }),
        operation: 'destructive',
      };
    case ConfirmationType.StopCheckin:
      return {
        buttonText: m.button_text_stop_check_in(),
        message: m.warning_prompt_stop_checkin({ title: props.title }),
        operation: 'destructive',
      };
    case ConfirmationType.DeleteComment:
      return {
        buttonText: m.button_text_delete_comment(),
        message: m.warning_prompt_delete_comment(),
        operation: 'destructive',
      };
  }
}
