import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { smartListDraftQuery } from '$lib/requests/queries/users/smartListDraftQuery.ts';
import { useConvertSmartList } from '$lib/sections/smart-lists/useConvertSmartList.ts';
import { BehaviorSubject } from 'rxjs';

type ConvertNudgeListProps = {
  slug: string;
  name: string;
};

export function useConvertNudgeList() {
  const client = useQueryClient();
  const { convertList } = useConvertSmartList();
  const isConverting = new BehaviorSubject(false);

  const convert = async ({ slug, name }: ConvertNudgeListProps) => {
    isConverting.next(true);

    try {
      const draft = await client.fetchQuery(
        smartListDraftQuery({ userId: 'me', listId: slug }),
      );

      return draft ? await convertList({ listId: slug, name, draft }) : null;
    } catch {
      return null;
    } finally {
      isConverting.next(false);
    }
  };

  return { convert, isConverting };
}
