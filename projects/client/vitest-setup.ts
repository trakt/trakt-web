//https://github.com/testing-library/jest-dom?tab=readme-ov-file#with-vitest
import '@testing-library/jest-dom/vitest';
import './test/mocks/animate.mock.ts';
import './test/mocks/env.mock.ts';
import './test/mocks/IntersectionObserver.mock.ts';
import './test/mocks/matchMedia.mock.ts';
import './test/mocks/messages.mock.ts';
import './test/mocks/navigation.mock.ts';
import './test/mocks/navigator.mock.ts';
import './test/mocks/variables.mock.ts';

import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './src/mocks/server.ts';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
