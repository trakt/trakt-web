export function createStateValue<T>(initial: T) {
  let value = $state.raw(initial);

  return {
    get value() {
      return value;
    },
    set: (next: T) => {
      value = next;
    },
  };
}
