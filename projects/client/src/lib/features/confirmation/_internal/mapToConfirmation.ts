import * as m from '$lib/features/i18n/messages.ts';
import type { Confirmation } from '../models/Confirmation.ts';
import type { ConfirmationPreflight } from '../models/ConfirmationPreflight.ts';
import type { ConfirmationParams } from '../models/ConfirmationParams.ts';
import { ConfirmationType } from '../models/ConfirmationType.ts';
import { getWarningMessage } from './getWarningMessage.ts';

type ConfirmationBuilder<T extends ConfirmationType> = (
  props: ConfirmationParams<T>,
) => Confirmation;

const toExportFirstPreflight = (): ConfirmationPreflight => ({
  label: m.switch_label_export_before_destructive(),
  hint: m.description_export_before_destructive(),
  isEnabledByDefault: true,
});

const toLeavePageConfirmation = (message: string) => ({
  title: m.confirmation_title_leave_page(),
  message,
  buttonText: m.button_text_leave(),
  cancelText: m.button_text_stay(),
  operation: 'destructive' as const,
});

type ConfirmationBuilders = {
  [T in ConfirmationType]: ConfirmationBuilder<T>;
};

const CONFIRMATION_BUILDERS: ConfirmationBuilders = {
  [ConfirmationType.MarkAsWatched]: (props) => ({
    title: m.confirmation_title_mark_as_watched(),
    buttonText: m.button_text_mark_as_watched(),
    message: getWarningMessage(props.title, props.target),
    operation: 'affirmative',
  }),
  [ConfirmationType.RemoveFromWatched]: (props) => ({
    title: m.confirmation_title_remove_from_watched(),
    buttonText: m.button_text_remove(),
    message: m.warning_prompt_remove_from_watched({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFromHistory]: (props) => ({
    title: m.confirmation_title_remove_play(),
    buttonText: m.button_text_remove(),
    message: m.warning_prompt_remove_single_watched({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.DropShow]: (props) => ({
    title: m.confirmation_title_drop_show(),
    buttonText: m.button_text_drop(),
    message: m.warning_prompt_drop_show({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.DropMovie]: (props) => ({
    title: m.confirmation_title_drop_movie(),
    buttonText: m.button_text_drop(),
    message: m.warning_prompt_drop_movie({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RestoreShow]: (props) => ({
    title: m.confirmation_title_restore_show(),
    buttonText: m.button_text_restore(),
    message: m.warning_prompt_restore_show({ title: props.title }),
    operation: 'affirmative',
  }),
  [ConfirmationType.StartRewatching]: (props) => ({
    title: m.confirmation_title_start_rewatching(),
    buttonText: m.button_text_rewatch(),
    message: m.confirmation_message_start_rewatching({ title: props.title }),
    operation: 'affirmative',
  }),
  [ConfirmationType.DeleteList]: (props) => ({
    title: m.confirmation_title_delete_list(),
    buttonText: m.button_text_delete(),
    message: m.warning_prompt_delete_list({ name: props.name }),
    operation: 'destructive',
  }),
  [ConfirmationType.LeaveCollaboration]: (props) => ({
    title: m.confirmation_title_leave_collaboration(),
    buttonText: m.button_text_leave(),
    message: m.warning_prompt_leave_collaboration({ name: props.name }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFavorite]: (props) => ({
    title: m.confirmation_title_remove_favorite(),
    buttonText: m.button_text_remove(),
    message: m.warning_prompt_remove_from_favorites({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFromWatchList]: (props) => ({
    title: m.confirmation_title_remove_from_watchlist(),
    buttonText: m.button_text_remove(),
    message: m.warning_prompt_remove_from_watchlist({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveFromList]: (props) => ({
    title: m.confirmation_title_remove_from_list(),
    buttonText: m.button_text_remove(),
    message: m.warning_prompt_remove_from_personal_list({
      list: props.name,
      title: props.title,
    }),
    operation: 'destructive',
  }),
  [ConfirmationType.UnfollowUser]: (props) => ({
    title: m.confirmation_title_unfollow_user(),
    buttonText: m.button_text_unfollow(),
    message: m.warning_prompt_unfollow_user({
      username: props.username,
    }),
    operation: 'destructive',
  }),
  [ConfirmationType.BlockUser]: (props) => ({
    title: m.confirmation_title_block_user(),
    buttonText: m.button_text_block(),
    message: m.confirmation_message_block_user({ username: props.username }),
    operation: 'destructive',
  }),
  [ConfirmationType.StopCheckin]: (props) => ({
    title: m.confirmation_title_stop_checkin(),
    buttonText: m.button_text_stop(),
    cancelText: m.button_text_keep_watching(),
    message: m.warning_prompt_stop_checkin({ title: props.title }),
    operation: 'destructive',
  }),
  [ConfirmationType.DeleteComment]: () => ({
    title: m.confirmation_title_delete_comment(),
    buttonText: m.button_text_delete(),
    message: m.warning_prompt_delete_comment(),
    operation: 'destructive',
  }),
  [ConfirmationType.DeleteNote]: () => ({
    title: m.confirmation_title_delete_note(),
    buttonText: m.button_text_delete(),
    message: m.warning_prompt_delete_note(),
    operation: 'destructive',
  }),
  [ConfirmationType.Logout]: () => ({
    title: m.confirmation_title_log_out(),
    buttonText: m.button_text_logout(),
    message: m.warning_prompt_log_out(),
    operation: 'destructive',
  }),
  [ConfirmationType.DeleteAccount]: (props) => ({
    title: m.confirmation_title_delete_account(),
    buttonText: m.button_text_delete(),
    message: m.warning_prompt_delete_account(),
    operation: 'destructive',
    challenge: {
      label: m.confirmation_challenge_delete_account({
        username: props.username,
      }),
      value: props.username,
      placeholder: props.username,
    },
    preflight: toExportFirstPreflight(),
  }),
  [ConfirmationType.SimpleFilters]: () => ({
    title: m.confirmation_title_reset_filters(),
    buttonText: m.button_text_switch(),
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
  [ConfirmationType.CancelImport]: () =>
    toLeavePageConfirmation(m.warning_prompt_cancel_import()),
  [ConfirmationType.CancelClear]: () =>
    toLeavePageConfirmation(m.warning_prompt_cancel_clear()),
  [ConfirmationType.SwitchClearSource]: () => ({
    title: m.confirmation_title_stop_clear(),
    message: m.confirmation_message_switching_stops_clearing(),
    buttonText: m.button_text_switch(),
    cancelText: m.button_text_keep_clearing(),
    operation: 'destructive',
  }),
  [ConfirmationType.CancelExport]: () =>
    toLeavePageConfirmation(m.warning_prompt_cancel_export()),
  [ConfirmationType.ProceedAfterPartialExport]: (props) => ({
    title: m.confirmation_title_sections_failed({
      failed: props.failed,
      total: props.total,
    }),
    buttonText: m.button_text_continue_anyway(),
    cancelText: m.button_text_go_back(),
    message: m.confirmation_message_sections_failed(),
    operation: 'destructive',
  }),
  [ConfirmationType.ClearData]: (props) => ({
    title: m.confirmation_title_clear_data(),
    buttonText: props.isCustomLibrary
      ? m.button_export_clear_custom_library()
      : m.button_text_clear(),
    message: props.isCustomLibrary
      ? m.warning_prompt_clear_custom_library()
      : m.warning_prompt_clear_data({ source: props.sourceText }),
    operation: 'destructive',
    preflight: props.isCustomLibrary ? undefined : toExportFirstPreflight(),
  }),
  [ConfirmationType.CleanUpHistory]: (props) => ({
    title: m.confirmation_title_clean_up_history(),
    buttonText: m.button_text_remove(),
    message:
      props.keeps === 'oldest'
        ? m.warning_prompt_clean_up_history({ count: props.count })
        : m.warning_prompt_clean_up_history_newest({ count: props.count }),
    operation: 'destructive',
    preflight: toExportFirstPreflight(),
  }),
  [ConfirmationType.HideRecommendation]: (props) => ({
    title: m.confirmation_title_hide_recommendation(),
    buttonText: m.button_text_hide(),
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
    cancelText: m.button_text_keep_editing(),
    message: m.warning_prompt_discard_changes(),
    operation: 'destructive',
  }),
  [ConfirmationType.RemoveMediaSyncServer]: (props) => ({
    title: m.confirmation_title_remove_server(),
    buttonText: m.button_text_remove(),
    message: m.confirmation_message_remove_named_server({
      server: props.server,
    }),
    operation: 'destructive',
  }),
  [ConfirmationType.ResetCoverImage]: () => ({
    title: m.confirmation_title_reset_cover_image(),
    buttonText: m.button_text_reset_cover_image(),
    message: m.confirmation_message_reset_cover_image(),
    operation: 'destructive',
  }),
  [ConfirmationType.SetCoverImage]: (props) => ({
    title: m.button_text_set_cover_image(),
    buttonText: m.button_text_set_as_cover(),
    message: m.warning_prompt_set_cover_image({ title: props.title }),
    operation: 'affirmative',
  }),
  [ConfirmationType.RevokeApp]: (props) => ({
    title: m.confirmation_title_revoke_app(),
    buttonText: m.button_text_revoke(),
    message: m.confirmation_message_revoke_app({ name: props.name }),
    operation: 'destructive',
  }),
};

export function mapToConfirmation<T extends ConfirmationType>(
  props: ConfirmationParams<T>,
): Confirmation {
  const build = CONFIRMATION_BUILDERS[props.type] as ConfirmationBuilder<T>;
  return build(props);
}
