import React from 'react';
import { ANNOUNCEMENTS } from '../constants';
import { Bell, AlertCircle } from 'lucide-react';

export const Updates: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4">
          <span className="text-yellow-400">/</span> SYSTEM_UPDATES
        </h2>
      </div>

      <div className="bg-cyber-black border border-cyber-panel rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="bg-cyber-panel px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <span className="font-bold text-gray-200 flex items-center gap-2">
            <Bell size={18} className="text-yellow-400 animate-pulse" />
            LATEST ANNOUNCEMENTS
          </span>
          <span className="text-xs text-gray-500 font-mono">LIVE_FEED</span>
        </div>

        <div className="divide-y divide-gray-800">
          {ANNOUNCEMENTS.map((update, index) => (
            <div key={update.id} className="p-6 hover:bg-white/5 transition-colors group">
              <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-2">
                <h4 className="text-lg font-bold text-white group-hover:text-cyber-neonBlue transition-colors">
                  {update.title}
                </h4>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      update.priority === 'High' 
                        ? 'text-red-400 border-red-900 bg-red-900/20' 
                        : update.priority === 'Normal' 
                          ? 'text-blue-400 border-blue-900 bg-blue-900/20' 
                          : 'text-gray-400 border-gray-700 bg-gray-800'
                    }`}>
                      {update.priority}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{update.date}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm pl-0 sm:pl-4 border-l-2 border-transparent group-hover:border-cyber-neonBlue transition-all">
                {update.content}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-cyber-panel/50 px-6 py-3 text-center border-t border-gray-800">
          <button className="text-sm text-cyber-neonBlue hover:text-white transition-colors">
            View All Archived Updates
          </button>
        </div>
      </div>
    </div>
  );
};