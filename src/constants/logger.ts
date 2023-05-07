export const LOGGER_LABEL = 'PFG-MESSENGER';

export const LOGGER_DATE_FORMAT = 'YY-MM-DD HH:mm:ss.SSS';

export const LOGGER_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
};

export const LOGGER_COLORS = {
  [LOGGER_LEVELS.ERROR]: 'bold red',
  [LOGGER_LEVELS.WARN]: 'bold yellow',
  [LOGGER_LEVELS.INFO]: 'bold green',
  [LOGGER_LEVELS.HTTP]: 'bold blue',
  [LOGGER_LEVELS.DEBUG]: 'bold magenta',
};
