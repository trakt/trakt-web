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
  cancelText?: string;
  operation: ConfirmationOperation;
};

type ConfirmationBuilder<T extends ConfirmationType> = (
  props: ConfirmationParams<T>,
) => Confirmation;

type ConfirmationBuilders = {
  [T in ConfirmationType]: ConfirmationBuilder<T>;
};

const CONFIRMATION_BUILDERS: ConfirmationBuilders = {
  [ConfirmationType.MarkAsWatched]: (props) => ({
    title: m.confirmation_title_mark_as_watched(),
    buttonText: m.button_text_mark_as_watched(),
    message: getWarningMessage(props.title, props.target),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFromWatched]: (props) => ({
    title: m.confirmation_title_remove_from_watched(),
    buttonText: m.button_text_remove_from_history(),
    message: m.warning_prompt_remove_from_watched({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFromHistory]: (props) => ({
    title: m.confirmation_title_remove_play(),
    buttonText: m.button_text_remove_from_history(),
    message: m.warning_prompt_remove_single_watched({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.DropShow]: (props) => ({
    title: m.confirmation_title_drop_show(),
    buttonText: m.button_text_drop_show(),
    message: m.warning_prompt_drop_show({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.DropMovie]: (props) => ({
    title: m.confirmation_title_drop_movie(),
    buttonText: m.button_text_drop_movie(),
    message: m.warning_prompt_drop_movie({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RestoreShow]: (props) => ({
    title: m.confirmation_title_restore_show(),
    buttonText: m.button_text_restore_show(),
    message: m.warning_prompt_restore_show({ title: props.title }),
    operation: 'affirmative',
  }),
  [ConfirmationType.StartRewatching]: (props) => ({
    title: m.confirmation_title_rewatching_prompt({ title: props.title }),
    buttonText: m.button_text_start_rewatching(),
    message: m.confirmation_message_rewatching_prompt(),
    operation: 'affirmative',
  }),
  [ConfirmationType.DeleteList]: (props) => ({
    title: m.confirmation_title_delete_list(),
    buttonText: m.button_text_delete_list(),
    message: m.warning_prompt_delete_list({ name: props.name }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFavorite]: (props) => ({
    title: m.confirmation_title_remove_favorite(),
    buttonText: m.button_text_remove_from_favorites(),
    message: m.warning_prompt_remove_from_favorites({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFromWatchList]: (props) => ({
    title: m.confirmation_title_remove_from_watchlist(),
    buttonText: m.button_text_remove_from_watchlist(),
    message: m.warning_prompt_remove_from_watchlist({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFromList]: (props) => ({
    title: m.confirmation_title_remove_from_list(),
    buttonText: m.button_text_remove_from_list(),
    message: m.warning_prompt_remove_from_personal_list({
      list: props.name,
      title: props.title,
    }),
    operation: 'destructive',
  }),
  [ConfirmationType.UnfollowUser]: (props) => ({
    title: m.confirmation_title_unfollow_user(),
    buttonText: m.button_text_unfollow(),
    message: m.warning_prompt_unfollow_user({ username: props.username }),
    operation: 'destructive',
  }),
  [ConfirmationType.BlockUser]: (props) => ({
    title: m.confirmation_title_block_user(),
    buttonText: m.button_text_block(),
    message: m.warning_prompt_block_user({ username: props.username }),
    detail: m.warning_prompt_block_user_detail(),
    operation: 'destructive',
  }),
  [ConfirmationType.StopCheckin]: (props) => ({
    title: m.confirmation_title_stop_checkin(),
    buttonText: m.button_text_stop_check_in(),
    message: m.warning_prompt_stop_checkin({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.DeleteComment]: () => ({
    title: m.confirmation_title_delete_comment(),
    buttonText: m.button_text_delete_comment(),
    message: m.warning_prompt_delete_comment(),
    operation: 'destructive',
  }),
  [ConfirmationType.DeleteNote]: () => ({
    title: m.confirmation_title_delete_note(),
    buttonText: m.button_text_delete_note(),
    message: m.warning_prompt_delete_note(),
    operation: 'destructive',
  }),
  [ConfirmationType.SuppressRatingsToast]: () => ({
    title: m.confirmation_title_suppress_ratings_toast(),
    buttonText: m.button_text_stop_asking(),
    message: m.warning_prompt_suppress_ratings_toast(),
    operation: 'destructive',
  }),
  [ConfirmationType.Logout]: () => ({
    title: m.confirmation_title_log_out(),
    buttonText: m.button_text_logout(),
    message: m.warning_prompt_log_out(),
    operation: 'destructive',
  }),
  [ConfirmationType.SimpleFilters]: () => ({
    title: m.confirmation_title_reset_filters(),
    buttonText: m.button_text_reset_all_filters(),
    message: m.warning_prompt_simple_filters(),
    operation: 'destructive',
  }),
  [ConfirmationType.CancelVip]: (props) => ({
    title: m.confirmation_title_cancel_vip(),
    buttonText: m.button_text_cancel_vip_prompt(),
    cancelText: m.button_text_keep_vip_prompt(),
    message: m.warning_prompt_cancel_vip({ date: props.renewsOn }),
    operation: 'preventative',
  }),
  [ConfirmationType.CancelImport]: () => ({
    title: m.confirmation_title_cancel_import(),
    buttonText: m.button_text_cancel_import(),
    message: m.warning_prompt_cancel_import(),
    operation: 'destructive',
  }),
  [ConfirmationType.CancelClear]: () => ({
    title: m.confirmation_title_stop_clear(),
    buttonText: m.button_text_stop_clear(),
    message: m.warning_prompt_cancel_clear(),
    operation: 'destructive',
  }),
  [ConfirmationType.ClearData]: (props) => ({
    title: m.confirmation_title_clear_data(),
    buttonText: m.button_text_clear_now(),
    message: m.warning_prompt_clear_data({ source: props.sourceText }),
    operation: 'destructive',
  }),
  [ConfirmationType.CleanUpHistory]: (props) => ({
    title: m.confirmation_title_clean_up_history(),
    buttonText: m.button_text_clean_up(),
    message: m.warning_prompt_clean_up_history({ count: props.count }),
    operation: 'destructive',
  }),
  [ConfirmationType.HideRecommendation]: (props) => ({
    title: m.confirmation_title_hide_recommendation(),
    buttonText: m.button_text_hide_recommendation(),
    message: m.warning_prompt_hide_recommendation({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.UnlinkStreaming]: (props) => ({
    title: m.confirmation_title_unlink_streaming({ service: props.service }),
    buttonText: m.button_text_unlink(),
    message: m.confirmation_message_unlink_streaming({
      service: props.service,
    }),
    operation: 'destructive',
  }),
  [ConfirmationType.UndoSync]: () => ({
    title: m.confirmation_title_undo_sync(),
    buttonText: m.button_text_undo(),
    message: m.confirmation_message_undo_sync(),
    operation: 'destructive',
  }),
  [ConfirmationType.DiscardChanges]: () => ({
    title: m.dialog_title_discard_changes(),
    buttonText: m.button_text_discard(),
    message: m.warning_prompt_discard_changes(),
    operation: 'destructive',
  }),
  [ConfirmationType.DisconnectPlex]: () => ({
    title: m.confirmation_title_disconnect_plex(),
    buttonText: m.button_disconnect_plex(),
    message: m.confirmation_message_disconnect_plex(),
    operation: 'destructive',
  }),
};

export function mapToConfirmation<T extends ConfirmationType>(
  props: ConfirmationParams<T>,
): Confirmation {
  const build = CONFIRMATION_BUILDERS[props.type] as ConfirmationBuilder<T>;
  return build(props);
}
