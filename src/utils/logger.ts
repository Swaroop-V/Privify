import log from 'loglevel';

// Set the default log level based on environment
if (import.meta.env.MODE === 'development') {
  log.setLevel('trace');
} else {
  log.setLevel('warn');
}

export const logger = log;
