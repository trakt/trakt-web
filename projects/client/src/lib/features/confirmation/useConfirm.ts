import { getConfirmationContext } from './_internal/getConfirmationContext.ts';
import { mapToConfirmation } from './_internal/mapToConfirmation.ts';
import type { ConfirmationParams } from './models/ConfirmationParams.ts';
import type { ConfirmationType } from './models/ConfirmationType.ts';

export function useConfirm() {
  const { showConfirmation } = getConfirmationContext();

  const confirm = <T extends ConfirmationType>(
    props: ConfirmationParams<T> & { onConfirm: () => void },
  ) => {
    return (event?: MouseEvent) => {
      const confirmation = mapToConfirmation(props);

      // If there is no message, confirm immediately
      if (!confirmation.message) {
        props.onConfirm();
        return;
      }

      showConfirmation({
        ...confirmation,
        onConfirm: props.onConfirm,
      });

      // Mimic native confirm behavior
      event?.stopImmediatePropagation();
    };
  };

  return { confirm };
}
