let initialized = false;

function formatStackTrace(error) {
  if (!error || !error.stack) {
    return '';
  }

  return error.stack
    .split('\n')
    .slice(1)
    .join('<br />');
}

function getActiveTabName() {
  if (globalThis.GUI?.active_tab) {
    return globalThis.GUI.active_tab;
  }
  return 'unknown';
}

function formatError(message, source, lineno, colno, error) {
  const tabName = getActiveTabName();
  let errorMessage = message;

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  let output = `<pre>[ERROR] [${tabName}] ${errorMessage}`;

  if (error && error.stack) {
    output += '<br />' + formatStackTrace(error);
  } else if (source) {
    output += `<br />  at ${source}:${lineno}:${colno || 0}`;
  }

  output += `</pre>`;

  return output;
}

export function initErrorHandler() {
  if (initialized) {
    return;
  }
  initialized = true;

  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'object' && message !== null) {
      error = message;
      message = error.message || 'Unknown error';
    }

    const formatted = formatError(message, source, lineno, colno, error);

    if (typeof globalThis.GUI?.log === 'function') {
      globalThis.GUI.log(formatted);
    }

    console.error('[uncaught exception]', formatted);

    return false;
  };

  window.onunhandledrejection = function(event) {
    let errorMessage = 'Unhandled Promise Rejection';

    if (event.reason) {
      if (event.reason instanceof Error) {
        errorMessage = event.reason.message;
      } else if (typeof event.reason === 'string') {
        errorMessage = event.reason;
      } else if (typeof event.reason === 'object' && event.reason !== null) {
        errorMessage = event.reason.message || JSON.stringify(event.reason);
      }
    }

    const tabName = getActiveTabName();
    let output = `[ERROR] [${tabName}] Promise Rejection: ${errorMessage}`;

    if (event.reason instanceof Error && event.reason.stack) {
      output += '\n' + formatStackTrace(event.reason);
    }

    if (typeof globalThis.GUI?.log === 'function') {
      globalThis.GUI.log(output);
    }

    console.error('[unhandled promise rejection]', output);
  };

  console.log('Error handler initialized');
}
