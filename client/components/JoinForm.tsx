import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

export const JoinForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.department) newErrors.department = 'Please select a skill/department';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('/api/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', department: '' });
          setTimeout(() => setStatus('idle'), 3000);
        } else {
          console.error('Failed to submit');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-cyber-black p-8 md:p-12 rounded-2xl border border-cyber-panel shadow-2xl relative">
      {/* Decorative Borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-neonBlue rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-neonPink rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-neonPink rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-neonBlue rounded-br-lg"></div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-2">JOIN THE NETWORK</h2>
        <p className="text-gray-400">Become a part of the future. Sign up for updates and access.</p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-white">Transmission Received</h3>
          <p className="text-gray-400 mt-2">Welcome to the club, Initiate.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-cyber-neonBlue mb-2 tracking-wider">
                Identity Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-cyber-panel border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded p-3 text-white focus:outline-none focus:border-cyber-neonBlue focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all`}
                placeholder="John Doe"
              />
              {errors.name && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-cyber-neonBlue mb-2 tracking-wider">
                Comm Frequency (Email)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full bg-cyber-panel border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded p-3 text-white focus:outline-none focus:border-cyber-neonBlue focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all`}
                placeholder="john@example.com"
              />
              {errors.email && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.email}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-cyber-neonBlue mb-2 tracking-wider">
              Primary Skillset
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className={`w-full bg-cyber-panel border ${errors.department ? 'border-red-500' : 'border-gray-700'} rounded p-3 text-white focus:outline-none focus:border-cyber-neonBlue transition-all appearance-none cursor-pointer`}
            >
              <option value="">Select Department...</option>
              <option value="development">Web3 / Blockchain Development</option>
              <option value="design">UI/UX & 3D Design</option>
              <option value="research">AI Research</option>
              <option value="community">Community Management</option>
            </select>
            {errors.department && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={10} /> {errors.department}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyber-neonBlue to-cyber-neonPurple text-white font-bold py-4 rounded uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
          >
            <Send size={18} /> Initiate Sequence
          </button>
        </form>
      )}
    </div>
  );
};