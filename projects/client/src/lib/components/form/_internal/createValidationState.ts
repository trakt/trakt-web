import { writable } from '$lib/utils/store/WritableSubject.ts';
import type { ValidationProps } from '../models/ValidationProps.ts';

type ValidatableElement = {
  setCustomValidity: (message: string) => void;
};

export function createValidationState(
  getValidation: () => ValidationProps | Nil,
) {
  const hasError = writable(false);

  const validate = (element: ValidatableElement, value: string) => {
    const validation = getValidation();

    if (!validation) {
      return;
    }

    const isValid = validation.isValid(value);

    hasError.set(!isValid);
    element.setCustomValidity(isValid ? '' : validation.errorText);
  };

  return { hasError, validate };
}
