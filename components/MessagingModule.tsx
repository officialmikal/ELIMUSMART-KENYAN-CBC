
import React, { useState, useMemo } from 'react';
import { 
  Send, Smartphone, MessageCircle, Mail, Settings as SettingsIcon, 
  Users, CheckCircle, Clock, Search, Filter, AlertTriangle, 
  Eye, RefreshCw, BarChart3, ChevronRight, X, Info
} from 'lucide-react';
import { MESSAGE_TEMPLATES } from '../constants';
import { Student } from '../types';

interface MessagingModuleProps {
  students: Student[];
}

interface SentBroadcast {
  id: string;
  date: string;
  templateType: string;
  channel: string;
  target: string;
  count: number;
  status: 'Delivered' | 'Pending' | 'Failed';
}

const MessagingModule: React.FC<MessagingModuleProps> = ({ students }) => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'history'>('broadcast');
  const [activeChannel, setActiveChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('SMS');
  const [selectedTemplate, setSelectedTemplate] = useState(MESSAGE_TEMPLATES[0]);
  const [targetGroup, setTargetGroup] = useState('All Parents');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [broadcastHistory, setBroadcastHistory] = useState<SentBroadcast[]>([
    { id: '1', date: '2024-04-12 09:15', templateType: 'FEE_REMINDER', channel: 'SMS', target: 'Grade 4', count: 42, status: 'Delivered' },
    { id: '2', date: '2024-04-10 14:30', templateType: 'CLOSURE', channel: 'WhatsApp', target: 'All Parents', count: 842, status: 'Delivered' },
    { id: '3', date: '2024-04-05 11:20', templateType: 'CUSTOM', channel: 'SMS', target: 'Fee Balances > 0', count: 156, status: 'Failed' },
  ]);

  const targetCount = useMemo(() => {
    if (targetGroup === 'All Parents') return students.length;
    if (targetGroup === 'Fee Balances > 0') return students.filter(s => s.feeBalance > 0).length;
    if (targetGroup.startsWith('Grade')) return students.filter(s => s.grade === targetGroup).length;
    return 0;
  }, [targetGroup, students]);

  // Dynamic Preview Engine
  const previewText = useMemo(() => {
    const sampleStudent = students[0];
    let text = customMessage || selectedTemplate.content;
    return text
      .replace('[Student Name]', sampleStudent.name)
      .replace('[Amount]', sampleStudent.feeBalance.toLocaleString())
      .replace('[ADM]', sampleStudent.admNo)
      .replace('[Date]', '05/05/2024')
      .replace('[School Name]', 'Greenhill Academy');
  }, [customMessage, selectedTemplate, students]);

  const handleSendBroadcast = () => {
    setSending(true);
    setTimeout(() => {
      const newEntry: SentBroadcast = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        templateType: customMessage ? 'CUSTOM' : selectedTemplate.type,
        channel: activeChannel,
        target: targetGroup,
        count: targetCount,
        status: 'Delivered'
      };
      setBroadcastHistory([newEntry, ...broadcastHistory]);
      setSending(false);
      setShowConfirmModal(false);
      setCustomMessage('');
      setActiveTab('history');
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Parent Communication</h2>
          <p className="text-sm text-slate-500 font-medium">Bulk SMS, WhatsApp & Automated Notification Hub</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button 
             onClick={() => setActiveTab('broadcast')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
            New Broadcast
          </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
            Sent History
          </button>
        </div>
      </div>

      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Compose Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 space-y-10">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">1. Select Target Group</label>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                    Targets {targetCount} Recipients
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['All Parents', 'Fee Balances > 0', 'PP1', 'Grade 6', 'Grade 7 (JSS)'].map((group) => (
                    <button 
                      key={group} 
                      onClick={() => setTargetGroup(group)}
                      className={`p-4 text-[10px] font-black uppercase border-2 rounded-2xl transition-all ${targetGroup === group ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">2. Communication Channel</label>
                <div className="flex gap-3">
                  {[
                    { id: 'SMS', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { id: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { id: 'Email', icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50' }
                  ].map((ch) => (
                    <button 
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id as any)}
                      className={`flex-1 p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${activeChannel === ch.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                    >
                      <ch.icon className={`w-6 h-6 ${activeChannel === ch.id ? 'text-white' : ch.color}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{ch.id}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">3. Message Content</label>
                  <select 
                    className="text-[10px] font-black uppercase text-emerald-600 bg-transparent outline-none cursor-pointer"
                    onChange={(e) => {
                      const t = MESSAGE_TEMPLATES.find(t => t.id === e.target.value);
                      if (t) {
                        setSelectedTemplate(t);
                        setCustomMessage('');
                      }
                    }}
                  >
                    {MESSAGE_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.type.replace('_', ' ')} Template</option>)}
                    <option value="custom">Custom Content</option>
                  </select>
                </div>
                <div className="relative">
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[24px] p-6 min-h-[160px] text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    placeholder="Type broadcast content here..."
                    value={customMessage || selectedTemplate.content}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-4 right-6 flex gap-3">
                    <span className="text-[9px] font-black text-slate-300 uppercase">{(customMessage || selectedTemplate.content).length} Chars</span>
                    <span className="text-[9px] font-black text-slate-300 uppercase">{Math.ceil((customMessage || selectedTemplate.content).length / 160)} SMS Parts</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                   <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-relaxed">
                     Tip: Use tags like <span className="text-emerald-600">[Student Name]</span>, <span className="text-emerald-600">[Amount]</span>, and <span className="text-emerald-600">[Date]</span> for automated personalization.
                   </p>
                </div>
              </section>

              <button 
                onClick={() => setShowConfirmModal(true)}
                className="w-full bg-emerald-600 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Send className="w-6 h-6" /> Initialize Broadcast
              </button>
            </div>
          </div>

          {/* Sidebar: Live Preview & Status */}
          <div className="space-y-8">
            <section className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                     <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Simulator</p>
                        <p className="text-sm font-black uppercase">Recipient View</p>
                     </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10 italic relative">
                     <p className="text-sm font-medium text-slate-300 leading-relaxed">
                       "{previewText}"
                     </p>
                     <div className="absolute -bottom-2 right-6 w-4 h-4 bg-slate-900 rotate-45 border-r border-b border-white/10"></div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">GA</div>
                     <div>
                        <p className="text-[10px] font-black uppercase">Greenhill Academy</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Official Sender ID</p>
                     </div>
                  </div>
               </div>
               <BarChart3 className="absolute -bottom-8 -left-8 w-32 h-32 text-white/5" />
            </section>

            <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
               <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                 <RefreshCw className="w-4 h-4 text-emerald-600" /> Gateway Status
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Current Credits</span>
                    <span className="text-sm font-black text-emerald-600">KES 4,502.50</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[85%]"></div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                     <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                     <p className="text-[9px] font-black text-amber-700 uppercase leading-relaxed">Credits low. Recharge soon to prevent broadcast suspension.</p>
                  </div>
               </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in">
           <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-600" /> Communication Log
              </h3>
              <div className="relative w-full md:w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input type="text" placeholder="Search logs..." className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-xs font-bold outline-none" />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <tr>
                       <th className="px-10 py-6">Timestamp</th>
                       <th className="px-10 py-6">Message Category</th>
                       <th className="px-10 py-6">Audience</th>
                       <th className="px-10 py-6">Count</th>
                       <th className="px-10 py-6">Channel</th>
                       <th className="px-10 py-6">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {broadcastHistory.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-10 py-6 text-xs font-black text-slate-900">{item.date}</td>
                          <td className="px-10 py-6">
                             <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter bg-slate-100 px-2 py-1 rounded-md">
                                {item.templateType.replace('_', ' ')}
                             </span>
                          </td>
                          <td className="px-10 py-6 text-xs font-bold text-slate-600">{item.target}</td>
                          <td className="px-10 py-6 text-xs font-black text-slate-900">{item.count} Parents</td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                {item.channel === 'SMS' && <Smartphone className="w-3.5 h-3.5" />}
                                {item.channel === 'WhatsApp' && <MessageCircle className="w-3.5 h-3.5" />}
                                {item.channel === 'Email' && <Mail className="w-3.5 h-3.5" />}
                                {item.channel}
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${
                                item.status === 'Delivered' ? 'text-emerald-600' : 
                                item.status === 'Failed' ? 'text-red-600' : 'text-amber-600'
                             }`}>
                                <CheckCircle className="w-3 h-3" /> {item.status}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => !sending && setShowConfirmModal(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            {sending ? (
               <div className="p-20 text-center space-y-6">
                  <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pushing Packets...</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Africa's Talking API Handshake</p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-[progress_2s_ease-in-out_infinite]" style={{width: '30%'}}></div>
                  </div>
               </div>
            ) : (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                   <Send className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Broadcast Consent</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                  You are about to send <span className="text-emerald-600 font-bold">{activeChannel}</span> messages to 
                  <span className="text-slate-900 font-bold"> {targetCount} recipients</span>. SMS charges will apply to the school account.
                </p>
                <div className="space-y-3">
                   <button 
                    onClick={handleSendBroadcast}
                    className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                   >
                     Authorize Broadcast
                   </button>
                   <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="w-full py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                   >
                     Wait, Review Content
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingModule;
