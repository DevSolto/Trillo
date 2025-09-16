export type LogFunction = (
  message?: unknown,
  ...optionalParams: unknown[]
) => void;

export type LogLevel = 'silent' | 'error' | 'warn' | 'info';

export type Logger = {
  error: LogFunction;
  warn: LogFunction;
  info: LogFunction;
};

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  silent: -1,
  error: 0,
  warn: 1,
  info: 2,
} as const;

const resolveEnvLogLevel = (): LogLevel | undefined => {
  if (typeof process === 'undefined') {
    return undefined;
  }

  const rawValue = process.env.NEXT_PUBLIC_LOG_LEVEL ?? process.env.LOG_LEVEL;
  if (!rawValue) {
    return undefined;
  }

  switch (rawValue.trim().toLowerCase()) {
    case 'silent':
    case 'none':
    case 'off':
      return 'silent';
    case 'error':
    case 'err':
      return 'error';
    case 'warn':
    case 'warning':
      return 'warn';
    case 'info':
    case 'information':
      return 'info';
    default:
      return undefined;
  }
};

const defaultLogLevel: LogLevel =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'production'
    ? 'error'
    : 'warn';

const currentLogLevel: LogLevel = resolveEnvLogLevel() ?? defaultLogLevel;

const shouldLog = (level: Exclude<LogLevel, 'silent'>): boolean => {
  return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[currentLogLevel];
};

const bindConsoleMethod = (method: 'error' | 'warn' | 'info'): LogFunction => {
  if (typeof console === 'undefined') {
    return () => {};
  }

  const consoleMethod = console[method];
  if (typeof consoleMethod !== 'function') {
    return () => {};
  }

  return consoleMethod.bind(console);
};

const createLogFunction = (
  level: Exclude<LogLevel, 'silent'>,
  handler: LogFunction
): LogFunction => {
  return (message?: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog(level)) {
      return;
    }
    handler(message, ...optionalParams);
  };
};

export const error: LogFunction = createLogFunction(
  'error',
  bindConsoleMethod('error')
);
export const warn: LogFunction = createLogFunction(
  'warn',
  bindConsoleMethod('warn')
);
export const info: LogFunction = createLogFunction(
  'info',
  bindConsoleMethod('info')
);

const baseLogger: Logger = {
  error,
  warn,
  info,
};

export const logger: Logger = baseLogger;

Object.freeze(baseLogger);

export const getLogLevel = (): LogLevel => currentLogLevel;

export const isLogLevelEnabled = (
  level: Exclude<LogLevel, 'silent'>
): boolean => shouldLog(level);
