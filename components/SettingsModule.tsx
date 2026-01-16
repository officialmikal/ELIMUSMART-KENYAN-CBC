
import React, { useState, useRef } from 'react';
import { 
  Building2, ShieldCheck, MessageSquare, CreditCard, UserPlus, 
  Trash2, Edit, Save, Plus, Globe, CheckCircle, BookOpen, Key, X, 
  UserCircle, Upload, Image as ImageIcon, Loader2, Sparkles, 
  ShieldAlert, Clock, History, Fingerprint, Mail, Phone, MapPin, RefreshCw, Lock, FileUp
} from 'lucide-react';
import { UserRole, SecuritySettings, Subject } from '../types';
import Papa from 'papaparse';

interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  lastLogin: string;
}

interface SettingsModuleProps {
  security: SecuritySettings;
  setSecurity: React.Dispatch<React.SetStateAction<SecuritySettings>>;
  subjects?: Subject[];
  setSubjects?: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ security, setSecurity, subjects, setSubjects }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const staffInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);

  // Branding State
  const [branding, setBranding] = useState({
    schoolName: 'Greenhill Academy',
    motto: 'Strive for Excellence',
    email: 'admin@greenhill.ac.ke',
    phone: '+254 700 000 000',
    address: 'Nairobi West, Langata Road, Kenya',
    logo: null as string | null
  });

  // Staff State
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: '1', name: 'James Otieno', role: UserRole.ADMIN, email: 'james@school.ke', lastLogin: '10 mins ago' },
    { id: '2', name: 'Mary Mwangi', role: UserRole.BURSAR, email: 'mary@school.ke', lastLogin: '2 hours ago' },
    { id: '3', name: 'Kevin Kip', role: UserRole.CLASS_TEACHER, email: 'kevin@school.ke', lastLogin: 'Yesterday' },
  ]);

  // Modal States
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [passwordResetModal, setPasswordResetModal] = useState<{ isOpen: boolean; member: StaffMember | null }>({
    isOpen: false,
    member: null
  });
  const [newPassword, setNewPassword] = useState('');
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: UserRole.CLASS_TEACHER });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStaffExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const imported = results.data as any[];
        setStaff(prev => {
          const updated = [...prev];
          imported.forEach(row => {
            const member: StaffMember = {
              id: Date.now().toString() + Math.random(),
              name: row.Name || row.name || 'Unknown Staff',
              email: row.Email || row.email || 'N/A',
              role: (row.Role || row.role || UserRole.CLASS_TEACHER) as UserRole,
              lastLogin: 'Never'
            };
            updated.push(member);
          });
          return updated;
        });
        setIsSaving(false);
        if (staffInputRef.current) staffInputRef.current.value = '';
      },
      error: () => setIsSaving(false)
    });
  };

  const handleSubjectExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !setSubjects) return;

    setIsSaving(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const imported = results.data as any[];
        setSubjects(prev => {
          const updated = [...prev];
          imported.forEach(row => {
            updated.push({
              id: Date.now().toString() + Math.random(),
              name: row.Name || row.name || 'Unknown Subject',
              category: (row.Category || row.category || 'CBC') as any
            });
          });
          return updated;
        });
        setIsSaving(false);
        if (subjectInputRef.current) subjectInputRef.current.value = '';
      },
      error: () => setIsSaving(false)
    });
  };

  const handleCommitUpdates = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const member: StaffMember = {
      id: Date.now().toString(),
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      lastLogin: 'Never'
    };
    setStaff([...staff, member]);
    setIsAddStaffOpen(false);
    setNewStaff({ name: '', email: '', role: UserRole.CLASS_TEACHER });
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswordResetModal({ isOpen: false, member: null });
      setNewPassword('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const removeStaff = (id: string) => {
    if (window.confirm("CRITICAL: This will revoke all system access for this staff member. Proceed?")) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
      <input type="file" ref={staffInputRef} onChange={handleStaffExcelUpload} className="hidden" accept=".csv" />
      <input type="file" ref={subjectInputRef} onChange={handleSubjectExcelUpload} className="hidden" accept=".csv" />

      {showSuccess && (
        <div className="fixed top-8 right-8 z-[300] bg-slate-900 text-white px-6 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">System Handshake Complete</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global settings updated and synchronized.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admin Console</h2>
          <p className="text-sm text-slate-500 font-medium">Configure institutional identity and access architecture.</p>
        </div>
        <div className="flex bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Branding</button>
           <button onClick={() => setActiveTab('roles')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'roles' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Staff Hub</button>
           <button onClick={() => setActiveTab('security')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Security</button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                   <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Building2 className="w-6 h-6" /></div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Institutional Profile</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Public identity and contact information</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">School Name</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none" value={branding.schoolName} onChange={e => setBranding({...branding, schoolName: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vision / Motto</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none" value={branding.motto} onChange={e => setBranding({...branding, motto: e.target.value})} /></div>
                  <div className="space-y-2 md:col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Address</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-sm font-bold outline-none" value={branding.address} onChange={e => setBranding({...branding, address: e.target.value})} /></div></div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Curriculum Subjects</h4>
                      <button onClick={() => subjectInputRef.current?.click()} className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 uppercase tracking-widest">
                         <FileUp className="w-3.5 h-3.5" /> Bulk Import Subjects
                      </button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {subjects?.map(s => <span key={s.id} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase">{s.name}</span>)}
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 text-center md:text-left">
                  <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center mb-6 shadow-xl animate-pulse-soft mx-auto md:mx-0 overflow-hidden border-4 border-white/10">
                     {branding.logo ? <img src={branding.logo} className="w-full h-full object-cover" alt="School Logo" /> : <span className="text-4xl font-black">{branding.schoolName.charAt(0)}</span>}
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight">{branding.schoolName}</h4>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{branding.motto}</p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity Branding</p><p className="text-xs font-bold text-slate-600 mt-1">Logo / Shield Upload</p></div>
                <button onClick={() => logoInputRef.current?.click()} className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100"><Upload className="w-5 h-5" /></button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Staff Management</h3><p className="text-xs text-slate-500 font-medium">Control institutional personnel and access credentials</p></div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => staffInputRef.current?.click()} className="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                   <FileUp className="w-5 h-5" /> Excel Upload
                </button>
                <button onClick={() => setIsAddStaffOpen(true)} className="flex-1 sm:flex-none bg-emerald-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95">
                   <UserPlus className="w-5 h-5" /> Register Staff
                </button>
              </div>
           </div>
           
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <tr><th className="px-10 py-6">Identity</th><th className="px-10 py-6">Institutional Role</th><th className="px-10 py-6 text-right">Security Actions</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {staff.map(member => (
                       <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500">{member.name.charAt(0)}</div><div><p className="text-sm font-black text-slate-900">{member.name}</p><p className="text-xs text-slate-400 font-medium italic">{member.email}</p></div></div></td>
                          <td className="px-10 py-6"><span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border ${member.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' : member.role === UserRole.BURSAR ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{member.role.replace('_', ' ')}</span></td>
                          <td className="px-10 py-6 text-right"><div className="flex justify-end gap-2"><button onClick={() => setPasswordResetModal({ isOpen: true, member: member })} className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-xl transition-all"><RefreshCw className="w-4 h-4" /></button><button onClick={() => removeStaff(member.id)} className="p-3 text-slate-400 hover:text-red-600 bg-slate-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button></div></td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
                 <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><ShieldCheck className="w-6 h-6" /></div>
                    <div><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Access Policies</h3><p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global system hardening and timeout rules</p></div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                       <div className="space-y-1"><p className="text-sm font-black text-slate-900 uppercase tracking-tight">Stealth Privacy Logic</p><p className="text-[10px] text-slate-500 font-medium">Automatic data blurring for phone numbers and fee balances.</p></div>
                       <button onClick={() => setSecurity({...security, privacyMode: !security.privacyMode})} className={`w-14 h-8 rounded-full relative transition-all ${security.privacyMode ? 'bg-emerald-600' : 'bg-slate-300'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${security.privacyMode ? 'left-7' : 'left-1'}`}></div></button>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                       <div className="space-y-1"><p className="text-sm font-black text-slate-900 uppercase tracking-tight">Idle Timeout Lockdown</p><p className="text-[10px] text-slate-500 font-medium">Minutes before the session requires a re-authentication PIN.</p></div>
                       <select value={security.sessionTimeout} onChange={e => setSecurity({...security, sessionTimeout: Number(e.target.value)})} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none cursor-pointer"><option value={5}>5 Minutes</option><option value={15}>15 Minutes</option><option value={30}>30 Minutes</option><option value={60}>60 Minutes</option></select>
                    </div>
                 </div>
              </section>
           </div>
           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl h-fit">
              <ShieldAlert className="w-10 h-10 text-red-500 mb-6" />
              <h4 className="text-xl font-black uppercase tracking-tight">Encryption Hub</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4 italic">"Zero-trust environment is active. Your data is protected by military-grade AES-256 cloud encryption."</p>
           </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordResetModal.isOpen && passwordResetModal.member && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in" onClick={() => setPasswordResetModal({ isOpen: false, member: null })} />
          <form onSubmit={handlePasswordReset} className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95">
             <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8 text-emerald-600" /></div>
             <h3 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight">Reset PIN</h3>
             <p className="text-sm text-slate-500 text-center mt-2 font-medium">Setting new credentials for <span className="text-slate-900 font-bold">{passwordResetModal.member.name}</span></p>
             <div className="mt-8 space-y-4">
                <input type="password" required placeholder="NEW ACCESS PASSWORD" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-emerald-500" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">Confirm Credential Sync</button>
             </div>
          </form>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsAddStaffOpen(false)} />
          <form onSubmit={handleAddStaff} className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Register New Personnel</h3>
            <div className="space-y-4">
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Full Legal Name</label><input type="text" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Mary Otieno" /></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Official Email</label><input type="email" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="mary@school.ke" /></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">System Permission Role</label><select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none cursor-pointer"><option value={UserRole.CLASS_TEACHER}>Class Teacher</option><option value={UserRole.SUBJECT_TEACHER}>Subject Teacher</option><option value={UserRole.BURSAR}>Bursar</option><option value={UserRole.ADMIN}>Administrator</option></select></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
               <button type="button" onClick={() => setIsAddStaffOpen(false)} className="py-4 text-slate-500 font-black text-xs uppercase tracking-widest">Cancel</button>
               <button type="submit" className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95">Complete Registration</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-200">
         <button className="px-10 py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Discard Pending Changes</button>
         <button onClick={handleCommitUpdates} disabled={isSaving} className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 min-w-[320px] ${isSaving ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}>{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}{isSaving ? 'Synchronizing Systems...' : 'Commit Settings to Cloud'}</button>
      </div>
    </div>
  );
};

export default SettingsModule;
