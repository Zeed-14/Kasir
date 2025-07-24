// This is a simple in-memory logger that captures console messages
// and allows components to subscribe to them.

const logs = [];
const subscribers = new Set();

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
};

const addLog = (type, message) => {
  const newLog = {
    type,
    message,
    timestamp: new Date().toLocaleTimeString(),
  };
  logs.push(newLog);
  // Keep only the last 100 logs to prevent memory issues
  if (logs.length > 100) {
    logs.shift();
  }
  subscribers.forEach(callback => callback([...logs]));
};

// Override console methods
console.log = (...args) => {
  originalConsole.log(...args);
  addLog('log', args.join(' '));
};

console.warn = (...args) => {
  originalConsole.warn(...args);
  addLog('warn', args.join(' '));
};

console.error = (...args) => {
  originalConsole.error(...args);
  addLog('error', args.join(' '));
};

console.info = (...args) => {
  originalConsole.info(...args);
  addLog('info', args.join(' '));
};

// Export a subscribe function for React components to use
export const logger = {
  subscribe: (callback) => {
    subscribers.add(callback);
    // Immediately give the new subscriber the current logs
    callback([...logs]);
    return () => subscribers.delete(callback);
  },
  clear: () => {
    logs.length = 0;
    subscribers.forEach(callback => callback([]));
  }
};