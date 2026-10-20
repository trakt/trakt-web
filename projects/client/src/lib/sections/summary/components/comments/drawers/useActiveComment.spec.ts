import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import type { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticCommentsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticCommentsMappedMock.ts';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { useActiveComment } from './useActiveComment.ts';

type Confirm = ReturnType<typeof useConfirm>['confirm'];

const comment = assertDefined(MovieHereticCommentsMappedMock.at(0));

function createConfirm({ isAccepted }: { isAccepted: boolean }) {
  const confirm = vi.fn(
    (props: { onConfirm: (isPreflightEnabled: boolean) => void }) => () => {
      if (!isAccepted) return;
      props.onConfirm(false);
    },
  );

  return confirm as unknown as Confirm & typeof confirm;
}

describe('useActiveComment', () => {
  it('should switch the reply target without asking when there is no draft', async () => {
    const confirm = createConfirm({ isAccepted: false });
    const { activeComment, setReplying } = useActiveComment({ confirm });

    setReplying(comment, true);

    expect(confirm).not.toHaveBeenCalled();
    expect(await firstValueFrom(activeComment)).toEqual({
      id: comment.id,
      isReplying: true,
    });
  });

  it('should keep the reply open when discarding the draft is declined', async () => {
    const confirm = createConfirm({ isAccepted: false });
    const { activeComment, setReplying, registerDraft } = useActiveComment({
      source: { id: comment.id, isReplying: true },
      confirm,
    });

    registerDraft(() => true);
    setReplying(comment, false);

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ type: ConfirmationType.DiscardChanges }),
    );
    expect(await firstValueFrom(activeComment)).toEqual({
      id: comment.id,
      isReplying: true,
    });
  });

  it('should close the reply once discarding the draft is confirmed', async () => {
    const confirm = createConfirm({ isAccepted: true });
    const { activeComment, setReplying, registerDraft } = useActiveComment({
      source: { id: comment.id, isReplying: true },
      confirm,
    });

    registerDraft(() => true);
    setReplying(comment, false);

    expect(await firstValueFrom(activeComment)).toEqual({
      id: comment.id,
      isReplying: false,
    });
  });

  it('should run the action directly once the draft is unregistered', () => {
    const confirm = createConfirm({ isAccepted: false });
    const { registerDraft, discardDraftThen } = useActiveComment({ confirm });
    const action = vi.fn();

    const unregister = registerDraft(() => true);
    unregister();
    discardDraftThen(action);

    expect(confirm).not.toHaveBeenCalled();
    expect(action).toHaveBeenCalledOnce();
  });

  it('should ignore the cleanup of a draft that was already replaced', () => {
    const confirm = createConfirm({ isAccepted: false });
    const { registerDraft, discardDraftThen } = useActiveComment({ confirm });
    const action = vi.fn();

    const unregisterPrevious = registerDraft(() => false);
    registerDraft(() => true);
    unregisterPrevious();
    discardDraftThen(action);

    expect(confirm).toHaveBeenCalledOnce();
    expect(action).not.toHaveBeenCalled();
  });
});
