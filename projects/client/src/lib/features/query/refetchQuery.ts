import { firstValueFrom, type Observable } from 'rxjs';

type RefetchableQuery = {
  refetch: () => Promise<unknown>;
};

export async function refetchQuery(
  query: Observable<RefetchableQuery>,
): Promise<void> {
  const queryState = await firstValueFrom(query);
  await queryState.refetch();
}
