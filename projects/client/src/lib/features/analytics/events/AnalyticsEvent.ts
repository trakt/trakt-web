const ACTION_PREFIX = 'action.';

function buildEventKey<T extends string, K extends string>(
  prefix: T,
  action: K,
): `${T}.${K}` {
  return `${prefix}.${action}`;
}

  Theme = `${ACTION_PREFIX}theme`,
  Locale = `${ACTION_PREFIX}locale`,
}
