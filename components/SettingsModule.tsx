
import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, MessageSquare, CreditCard, UserPlus, 
  Trash2, Edit, Save, Plus, Globe, CheckCircle, BookOpen, Key, X, 
  UserCircle, Upload, Image as ImageIcon, Loader2, Sparkles, 
  ShieldAlert, Clock, History, Fingerprint, Mail, Phone, MapPin, RefreshCw, Lock
} from 'lucide-react';
import { UserRole, SecuritySettings } from '../types';

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
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ security, setSecurity }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Branding State
  const [branding, setBranding] = useState({
    schoolName: 'Greenhill Academy',
    motto: 'Strive for Excellence',
    email: 'admin@greenhill.ac.ke',
    phone: '+254 700 000 000',
    address: 'Nairobi West, Langata Road, Kenya'
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
    // In a real app, this would call an API to update the staff password
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
    if (confirm("Are you sure you want to revoke access for this staff member?")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[300] bg-slate-900 text-white px-6 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">Handshake Complete</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global settings updated and encrypted.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System Terminal</h2>
          <p className="text-sm text-slate-500 font-medium">Institutional Architecture & Access Control Hub</p>
        </div>
        <div className="flex bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Branding</button>
           <button onClick={() => setActiveTab('roles')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'roles' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Staff Directory</button>
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
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Public branding and location information</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">School Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={branding.schoolName}
                      onChange={e => setBranding({...branding, schoolName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vision / Motto</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={branding.motto}
                      onChange={e => setBranding({...branding, motto: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={branding.email}
                      onChange={e => setBranding({...branding, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Phone</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={branding.phone}
                      onChange={e => setBranding({...branding, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Address & Location</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                         value={branding.address}
                         onChange={e => setBranding({...branding, address: e.target.value})}
                       />
                    </div>
                  </div>
                </div>
             </div>
          </div>
          <div className="space-y-6">
             <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                   <Building2 className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-600 rounded-[28px] flex items-center justify-center mb-6 shadow-xl animate-pulse-soft">
                     <span className="text-3xl font-black">E</span>
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight">{branding.schoolName || 'Your School'}</h4>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{branding.motto || 'Education for Life'}</p>
                  <div className="mt-8 space-y-4 pt-6 border-t border-white/10">
                     <div className="flex items-center gap-3 text-xs text-slate-400"><Mail className="w-4 h-4 text-emerald-500" /> {branding.email}</div>
                     <div className="flex items-center gap-3 text-xs text-slate-400"><Phone className="w-4 h-4 text-emerald-500" /> {branding.phone}</div>
                     <div className="flex items-center gap-3 text-xs text-slate-400"><MapPin className="w-4 h-4 text-emerald-500" /> {branding.address}</div>
                  </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logo Branding</p>
                   <p className="text-xs font-bold text-slate-600 mt-1">Recommended 512x512 PNG</p>
                </div>
                <button className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100">
                   <Upload className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Personnel Directory</h3>
                 <p className="text-xs text-slate-500 font-medium">Manage institutional access credentials</p>
              </div>
              <button 
                onClick={() => setIsAddStaffOpen(true)}
                className="bg-emerald-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
              >
                 <UserPlus className="w-5 h-5" /> Add Staff Member
              </button>
           </div>
           
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <tr>
                       <th className="px-10 py-6">Staff Member</th>
                       <th className="px-10 py-6">Access Role</th>
                       <th className="px-10 py-6">Last Active</th>
                       <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {staff.map(member => (
                       <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                                   {member.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-900">{member.name}</p>
                                   <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border ${
                               member.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                               member.role === UserRole.BURSAR ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                             }`}>
                                {member.role.replace('_', ' ')}
                             </span>
                          </td>
                          <td className="px-10 py-6 text-xs text-slate-500 font-medium italic">{member.lastLogin}</td>
                          <td className="px-10 py-6 text-right">
                             <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setPasswordResetModal({ isOpen: true, member: member })}
                                  className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-xl transition-all" 
                                  title="Reset Password"
                                >
                                   <RefreshCw className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => removeStaff(member.id)} 
                                  className="p-3 text-slate-400 hover:text-red-600 bg-slate-50 rounded-xl transition-all" 
                                  title="Remove Member"
                                >
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Existing Security tab remains for consistency */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
                 <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><ShieldCheck className="w-6 h-6" /></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Security Hardening</h3>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global access and encryption protocols</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                       <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Stealth Privacy Mode</p>
                          <p className="text-[10px] text-slate-500 font-medium">Automatic data masking in all reports and lists.</p>
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
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Idle Timeout (Minutes)</p>
                          <p className="text-[10px] text-slate-500 font-medium">Automatic lock-screen activation.</p>
                       </div>
                       <select 
                         value={security.sessionTimeout}
                         onChange={e => setSecurity({...security, sessionTimeout: Number(e.target.value)})}
                         className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
                       >
                          <option value={5}>5 Mins</option>
                          <option value={15}>15 Mins</option>
                          <option value={30}>30 Mins</option>
                          <option value={60}>60 Mins</option>
                       </select>
                    </div>
                 </div>
              </section>
           </div>
           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl h-fit">
              <ShieldAlert className="w-10 h-10 text-red-500 mb-6" />
              <h4 className="text-xl font-black uppercase tracking-tight">AES-256 Vault</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4 italic">"Full end-to-end encryption is active for all institutional data transactions."</p>
           </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordResetModal.isOpen && passwordResetModal.member && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in" onClick={() => setPasswordResetModal({ isOpen: false, member: null })} />
          <form onSubmit={handlePasswordReset} className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95">
             <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-emerald-600" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight">Reset Credentials</h3>
             <p className="text-sm text-slate-500 text-center mt-2 font-medium">Update access PIN for <span className="text-slate-900 font-bold">{passwordResetModal.member.name}</span></p>
             <div className="mt-8 space-y-4">
                <input 
                  type="password" 
                  required
                  placeholder="NEW PIN / PASSWORD" 
                  className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
                   Change Credentials
                </button>
             </div>
          </form>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsAddStaffOpen(false)} />
          <form onSubmit={handleAddStaff} className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Register Staff</h3>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Full Name</label>
                  <input type="text" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. John Doe" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Institutional Email</label>
                  <input type="email" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" placeholder="staff@school.ke" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Access Role</label>
                  <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none cursor-pointer">
                     <option value={UserRole.CLASS_TEACHER}>Class Teacher</option>
                     <option value={UserRole.SUBJECT_TEACHER}>Subject Teacher</option>
                     <option value={UserRole.BURSAR}>Bursar / Accounts</option>
                     <option value={UserRole.ADMIN}>System Administrator</option>
                  </select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
               <button type="button" onClick={() => setIsAddStaffOpen(false)} className="py-4 text-slate-400 font-black text-xs uppercase tracking-widest">Cancel</button>
               <button type="submit" className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95">Enroll Staff</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-200">
         <button className="px-10 py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Discard Changes</button>
         <button 
            onClick={handleCommitUpdates}
            disabled={isSaving}
            className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 min-w-[320px] ${
              isSaving ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
            }`}
          >
           {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
           {isSaving ? 'Processing Updates...' : 'Authorize System-Wide Sync'}
         </button>
      </div>
    </div>
  );
};

export default SettingsModule;
