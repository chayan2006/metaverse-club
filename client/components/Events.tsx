import React, { useState } from 'react';
import { CLUB_EVENTS } from '../constants';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';

import { RegistrationModal } from './RegistrationModal';

export const Events: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Coming soon'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  const filteredEvents = filter === 'All'
    ? CLUB_EVENTS
    : CLUB_EVENTS.filter(e => e.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Ongoing': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Completed': return 'bg-gray-700/50 text-gray-400 border-gray-600';
      case 'Coming soon': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-800 text-white';
    }
  };

  const handleRegister = (id: string, name: string) => {
    setSelectedEventName(name);
    setSelectedEventId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventName={selectedEventName}
        eventId={selectedEventId}
      />

      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-2">
            <span className="text-cyber-neonPink">/</span> EVENTS_LOG
          </h2>
          <p className="text-gray-400">Hackathons, workshops, and community meetups.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Upcoming', 'Ongoing', 'Completed', 'Coming soon'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded text-sm font-semibold tracking-wide transition-all ${filter === status
                ? 'bg-cyber-neonPink text-white shadow-[0_0_10px_rgba(255,0,85,0.4)]'
                : 'bg-cyber-panel text-gray-400 hover:bg-gray-800'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`group bg-cyber-panel border border-white/5 transition-all duration-300 rounded-lg overflow-hidden relative flex flex-col h-full hover:-translate-y-2 hover:animate-border-pulse ${(event.status === 'Upcoming' || event.status === 'Ongoing') ? 'animate-size-pulse-custom' : ''
              }`}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-cyber-neonBlue to-cyber-neonPurple transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded text-xs font-bold border ${getStatusColor(event.status)}`}>
                  {event.status.toUpperCase()}
                </span>
                <span className="text-cyber-neonPurple text-xs border border-cyber-neonPurple/30 px-2 py-0.5 rounded">
                  {event.type}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyber-neonBlue transition-colors">
                {event.name}
              </h3>

              <div className="space-y-2 text-gray-400 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-cyber-neonBlue" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-cyber-neonBlue" />
                  <span>{event.location}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="p-4 bg-black/20 border-t border-white/5 flex justify-between items-center">
              <button className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-white flex items-center gap-1 transition-all duration-300">
                Details <span className="text-cyber-neonBlue transform transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
              </button>

              {event.id === '1' && (
                <button
                  onClick={() => handleRegister(event.id, event.name)}
                  className="text-xs font-bold uppercase tracking-wider bg-cyber-neonBlue/20 text-cyber-neonBlue border border-cyber-neonBlue/50 hover:bg-cyber-neonBlue hover:text-black px-3 py-1.5 rounded transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-cyber-panel/30 rounded-lg border border-dashed border-gray-700">
          <p>No events found for this category.</p>
        </div>
      )}
    </div>
  );
};