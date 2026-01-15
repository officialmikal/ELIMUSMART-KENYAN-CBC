
import React, { useState } from 'react';
import { Send, Smartphone, MessageCircle, Mail, Settings as SettingsIcon, Users, CheckCircle } from 'lucide-react';
import { MESSAGE_TEMPLATES } from '../constants';

const MessagingModule: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('SMS');
  const [selectedTemplate, setSelectedTemplate] = useState(MESSAGE_TEMPLATES[0]);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);

  const handleSendBroadcast = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentCount(142); // Mock count
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Parent Communication</h2>
          <p className="text-slate-500">Automated messaging for closures, openings, and fee balances.</p>
        </div>
        <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
          <SettingsIcon className="w-4 h-4" />
          Templates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Send Broadcast Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              New Broadcast
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['All Parents', 'Grade 6', 'Grade 7', 'Fee Balances > 0'].map((target) => (
                    <button key={target} className="p-3 text-xs font-bold border border-slate-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                      {target}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message Channel</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveChannel('SMS')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${activeChannel === 'SMS' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-xs font-bold">Bulk SMS</span>
                  </button>
                  <button 
                    onClick={() => setActiveChannel('WhatsApp')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${activeChannel === 'WhatsApp' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs font-bold">WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => setActiveChannel('Email')}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${activeChannel === 'Email' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                  >
                    <Mail className="w-6 h-6" />
                    <span className="text-xs font-bold">Email</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-bold text-slate-700">Message Content</label>
                   <select 
                     className="text-xs bg-slate-100 border-none rounded p-1 font-medium focus:ring-0"
                     onChange={(e) => setSelectedTemplate(MESSAGE_TEMPLATES.find(t => t.id === e.target.value)!)}
                   >
                     {MESSAGE_TEMPLATES.map(t => (
                       <option key={t.id} value={t.id}>{t.type.replace('_', ' ')}</option>
                     ))}
                   </select>
                </div>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  placeholder="Type your message here..."
                  value={selectedTemplate.content}
                  onChange={(e) => setSelectedTemplate({...selectedTemplate, content: e.target.value})}
                ></textarea>
                <p className="text-xs text-slate-400 mt-2">Personalize with tags: [Student Name], [Amount], [Date]</p>
              </div>

              <button 
                onClick={handleSendBroadcast}
                disabled={sending}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${sending ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                {sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Broadcast Now
                  </>
                )}
              </button>
              
              {sentCount && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <p className="text-sm font-bold text-emerald-800">Success! Messages queued for {sentCount} parents via {activeChannel}.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              SMS Gateway Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Service Provider</span>
                <span className="font-bold text-slate-800">Africa's Talking</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">SMS Balance</span>
                <span className="font-bold text-emerald-600">KES 4,502.50</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Sender ID</span>
                <span className="font-bold text-slate-800">ELIMUSMART</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                 <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 text-center uppercase tracking-wider font-bold">API Connection Active</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <h3 className="font-bold mb-4 relative z-10">M-Pesa Integration</h3>
            <p className="text-sm text-slate-400 mb-6 relative z-10">Real-time payment confirmations automatically trigger SMS receipts to parents.</p>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-bold text-emerald-400">MP</div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">STK Push</p>
                <p className="text-lg font-bold">Enabled</p>
              </div>
            </div>
            <button className="w-full py-2 bg-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-500 transition-colors relative z-10">
              Check Logs
            </button>
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Smartphone className="w-24 h-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingModule;
