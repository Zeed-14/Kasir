import React, { useState, useEffect, useRef } from 'react';
import { logger } from '../utils/logger';

const DebugConsole = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const consoleRef = useRef(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Subscribe to the logger service
    const unsubscribe = logger.subscribe(setLogs);
    return () => unsubscribe();
  }, []);

  // Auto-scroll to the bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div 
      ref={consoleRef}
      className="fixed bottom-0 left-0 w-full h-1/3 bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white font-mono text-xs shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-gray-800 p-2 flex justify-between items-center cursor-move">
        <span className="font-bold">Konsol Debug</span>
        <div>
          <button onClick={logger.clear} className="bg-gray-700 px-2 py-1 rounded mr-2 hover:bg-gray-600">Clear</button>
          <button onClick={onClose} className="bg-red-600 px-2 py-1 rounded hover:bg-red-500">Close</button>
        </div>
      </div>

      {/* Log Messages */}
      <div className="flex-1 p-2 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className={`flex gap-2 border-b border-gray-800 py-1 ${getLogColor(log.type)}`}>
            <span className="text-gray-500">{log.timestamp}</span>
            <span className="flex-1 whitespace-pre-wrap break-all">{log.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default DebugConsole;