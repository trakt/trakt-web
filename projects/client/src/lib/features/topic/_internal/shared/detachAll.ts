type Detach = () => void;

export function detachAll(detachers: ReadonlyArray<Detach | void>): Detach {
  return () => detachers.forEach((detach) => detach?.());
}
