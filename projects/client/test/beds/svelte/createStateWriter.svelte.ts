export function createStateWriter() {
  let writes = $state(0);

  return {
    write: () => {
      writes += 1;
    },
    get writes() {
      return writes;
    },
  };
}
