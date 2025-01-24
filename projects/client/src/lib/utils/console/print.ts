export enum LogLevel {
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
  info = 'info',
}

export enum PrintTarget {
  PWA = 'PWA',
  Monitor = 'Monitor',
}

const Colors = {
  Orange: '#ff7138',
  Blue: '#0092e7',
  Green: '#24d384',
  Purple: '#9f42c6',
  Red: '#e80000',
  Neutral: '#9ea6ac',
};

const targetToColorMap: Record<LogLevel | PrintTarget, string> = {
  [LogLevel.Log]: Colors.Neutral,
  [LogLevel.info]: Colors.Blue,
  [LogLevel.Warn]: Colors.Orange,
  [LogLevel.Error]: Colors.Red,
  [PrintTarget.PWA]: Colors.Blue,
  [PrintTarget.Monitor]: Colors.Green,
};

let inGroup = false;

export function print(
  target: LogLevel | PrintTarget,
  method: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'group' | 'groupEnd',
  ...args: unknown[]
) {
  // Skip if we're in production
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  // Special handling for Safari and group
  if (method === 'group') {
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      console[method](...args);
      return;
    }
  }

  const styles = [
    `background-color: ${targetToColorMap[target]}`,
    'border-radius: 0.5em',
    'color: white',
    'font-weight: bold',
    'padding: 2px 0.5em',
  ];

  const logPrefix = inGroup ? [] : [`%c${target}`, styles.join(';')];
  console[method](...logPrefix, ...args);

  if (method === 'group') {
    inGroup = true;
  }
  if (method === 'groupEnd') {
    inGroup = false;
  }
}

export function log(...args: unknown[]) {
  print(LogLevel.Log, 'log', ...args);
}

export function warn(...args: unknown[]) {
  print(LogLevel.Warn, 'warn', ...args);
}

export function error(...args: unknown[]) {
  print(LogLevel.Error, 'error', ...args);
}

export function info(...args: unknown[]) {
  print(LogLevel.Log, 'info', ...args);
}
