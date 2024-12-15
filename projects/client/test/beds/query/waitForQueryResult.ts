import { screen, waitFor } from '@testing-library/svelte';
import { expect } from 'vitest';
import { QUERY_TEST_ID } from './_internal/constants.ts';

export function waitForQueryResult() {
  return waitFor(() => {
    const result = screen.getByTestId(QUERY_TEST_ID);
    expect(result).toBeInTheDocument();

    const content = result.innerHTML;

    expect(content).toBeDefined();
    expect(content).not.toEqual('');

    return JSON.parse(content);
  });
}
