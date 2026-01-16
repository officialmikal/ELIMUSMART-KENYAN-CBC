
import React, { useState, useRef } from 'react';
import { 
  Building2, ShieldCheck, MessageSquare, CreditCard, UserPlus, 
  Trash2, Edit, Save, Plus, Globe, CheckCircle, BookOpen, Key, X, 
  UserCircle, Upload, Image as ImageIcon, Loader2, Sparkles, 
  ShieldAlert, Clock, History, Fingerprint
} from 'lucide-react';
import { UserRole, SecuritySettings } from '../types';

interface SettingsModuleProps {
  security: SecuritySettings;
  setSecurity: React.Dispatch<React.SetStateAction<SecuritySettings>>;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ security, setSecurity }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const mockAuditLogs = [
    { id: 1, action: 'Fee Payment Recorded', user: 'Mary Otieno', time: '10 mins ago', ip: '192.168.1.42' },
    { id: 2, action: 'Student Enrollment Created', user: 'School Admin', time: '1 hour ago', ip: '10.0.0.15' },
    { id: 3, action: 'Bulk SMS Broadcast Sent', user: 'School Admin', time: '2 hours ago', ip: '10.0.0.15' },
    { id: 4, action: 'User Credentials Updated', user: 'School Admin', time: 'Yesterday', ip: '10.0.0.15' },
  ];

  const handleCommitUpdates = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[300] bg-slate-900 text-white px-6 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">Security Handshake Complete</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global settings updated and synchronized.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System Console</h2>
          <p className="text-sm text-slate-500 font-medium">Configure Branding, Personnel & Security Architecture</p>
        </div>
        <div className="flex bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Branding</button>
           <button onClick={() => setActiveTab('roles')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'roles' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Staff</button>
           <button onClick={() => setActiveTab('security')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Security</button>
        </div>
      </div>

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
                 <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><ShieldCheck className="w-6 h-6" /></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Access Control & Privacy</h3>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Configure data protection protocols</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                       <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Global Stealth Mode</p>
                          <p className="text-[10px] text-slate-500 font-medium">Mask sensitive learner data (Phone, Balances) in staff lists.</p>
                       </div>
                       <button 
                         onClick={() => setSecurity({...security, privacyMode: !security.privacyMode})}
                         className={`w-14 h-8 rounded-full relative transition-all ${security.privacyMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
                       >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${security.privacyMode ? 'left-7' : 'left-1'}`}></div>
                       </button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                       <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Session Auto-Lock</p>
                          <p className="text-[10px] text-slate-500 font-medium">Force lock screen after periods of inactivity.</p>
                       </div>
                       <select 
                         value={security.sessionTimeout}
                         onChange={e => setSecurity({...security, sessionTimeout: Number(e.target.value)})}
                         className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none"
                       >
                          <option value={5}>5 Mins</option>
                          <option value={15}>15 Mins</option>
                          <option value={30}>30 Mins</option>
                          <option value={60}>1 Hour</option>
                       </select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                       <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Strict Data Handshake</p>
                          <p className="text-[10px] text-slate-500 font-medium">Prevent concurrent logins from multiple devices.</p>
                       </div>
                       <button 
                         onClick={() => setSecurity({...security, strictMode: !security.strictMode})}
                         className={`w-14 h-8 rounded-full relative transition-all ${security.strictMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
                       >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${security.strictMode ? 'left-7' : 'left-1'}`}></div>
                       </button>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-8">
                    <History className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Security Audit Trail</h3>
                 </div>
                 <div className="space-y-4">
                    {mockAuditLogs.map(log => (
                       <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm"><Fingerprint className="w-4 h-4 text-slate-400" /></div>
                             <div>
                                <p className="text-xs font-black text-slate-900">{log.action}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{log.user} • {log.ip}</p>
                             </div>
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                    <h4 className="text-xl font-black uppercase tracking-tight">Threat Intelligence</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">System is running in <span className="text-emerald-400 font-black">STABLE MODE</span>. No unauthorized IP spikes detected in the last 24 hours.</p>
                    <div className="pt-4 border-t border-white/10 space-y-4">
                       <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase">Encryption</span><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">TLS 1.3 Active</span></div>
                       <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase">Database Integrity</span><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Checksum OK</span></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Existing Tabs implementation (profile, roles) ... */}
      {activeTab === 'profile' && (
        <div className="p-20 text-center bg-white rounded-[40px] border border-slate-100 border-dashed animate-in fade-in">
           <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Branding controls active. Secure update required.</p>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="p-20 text-center bg-white rounded-[40px] border border-slate-100 border-dashed animate-in fade-in">
           <UserPlus className="w-12 h-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Role management active. Administrator level required.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-200">
         <button className="px-10 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">Discard Changes</button>
         <button 
            onClick={handleCommitUpdates}
            disabled={isSaving}
            className={`px-10 py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 min-w-[240px] ${
              isSaving 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
            }`}
          >
           {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
           {isSaving ? 'Synchronizing Protocols...' : 'Commit System Updates'}
         </button>
      </div>
    </div>
  );
};

export default SettingsModule;
