
import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, ShieldCheck, MessageSquare, CreditCard, UserPlus, 
  Trash2, Edit, Save, Plus, Globe, CheckCircle, BookOpen, Key, X, UserCircle, Upload, Image as ImageIcon, Loader2, Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'system'>('profile');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Institution Profile State
  const [profile, setProfile] = useState({
    schoolName: 'Greenhill Academy',
    location: "Lang'ata Road, Nairobi - Kenya",
    timezone: '(GMT+03:00) East African Time (Nairobi)',
    currency: 'Kenyan Shilling (KES)'
  });

  const [users, setUsers] = useState([
    { id: '1', name: 'Joseph Mwalimu', role: UserRole.CLASS_TEACHER, username: 'joseph' },
    { id: '2', name: 'Mary Otieno', role: UserRole.BURSAR, username: 'mary' },
    { id: '3', name: 'School Admin', role: UserRole.ADMIN, username: 'admin' },
  ]);

  // Provision User State
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: UserRole.CLASS_TEACHER,
    username: ''
  });

  const removeUser = (id: string) => {
    if (id === '3') return; // Prevent deleting the master admin
    setUsers(users.filter(u => u.id !== id));
  };

  const handleProvisionUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username) return;

    const userToAdd = {
      id: Date.now().toString(),
      ...newUser
    };

    setUsers([userToAdd, ...users]);
    setIsProvisionModalOpen(false);
    setNewUser({ name: '', role: UserRole.CLASS_TEACHER, username: '' });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoInput = () => {
    fileInputRef.current?.click();
  };

  const handleCommitUpdates = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      {/* Success Notification Toast */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[300] bg-slate-900 text-white px-6 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">System Synchronized</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution profiles and credentials updated.</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="ml-4 p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Administrator Console</h2>
          <p className="text-sm text-slate-500 font-medium">Global Access Control & System Architecture</p>
        </div>
        <div className="flex bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Branding</button>
           <button onClick={() => setActiveTab('roles')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'roles' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Staff</button>
           <button onClick={() => setActiveTab('system')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'system' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Integrations</button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Building2 className="w-6 h-6 text-emerald-600" /> Institution Profile</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Legal School Name</label>
                <input 
                  type="text" 
                  value={profile.schoolName} 
                  onChange={(e) => setProfile({...profile, schoolName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Physical Location</label>
                <input 
                  type="text" 
                  value={profile.location} 
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              
              <div className="space-y-3 pt-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Identity (Seal)</label>
                <div className="flex items-center gap-6">
                   <div className="relative group">
                     <div className="w-24 h-24 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[28px] flex items-center justify-center text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center px-4 overflow-hidden">
                       {logoUrl ? (
                         <img src={logoUrl} alt="School Seal" className="w-full h-full object-contain p-2" />
                       ) : (
                         "School Seal"
                       )}
                     </div>
                     {logoUrl && (
                       <button 
                        onClick={() => setLogoUrl(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <X className="w-3 h-3" />
                       </button>
                     )}
                   </div>
                   
                   <div className="flex flex-col gap-2">
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*" 
                       onChange={handleLogoUpload} 
                     />
                     <button 
                       onClick={triggerLogoInput}
                       className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
                     >
                       <Upload className="w-4 h-4" /> Upload New Logo
                     </button>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Recommended: Square PNG/SVG (Max 2MB)</p>
                   </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Globe className="w-6 h-6 text-emerald-600" /> Regional Configuration</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Timezone</label>
                <select 
                  value={profile.timezone}
                  onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none"
                >
                  <option>(GMT+03:00) East African Time (Nairobi)</option>
                  <option>(GMT+00:00) London / UTC</option>
                  <option>(GMT+02:00) Johannesburg</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Currency Symbol</label>
                <select 
                  value={profile.currency}
                  onChange={(e) => setProfile({...profile, currency: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none"
                >
                  <option>Kenyan Shilling (KES)</option>
                  <option>US Dollar (USD)</option>
                  <option>Euro (EUR)</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-top-6">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-emerald-600" /> Personnel & Staff Roles</h3>
            <button 
              onClick={() => setIsProvisionModalOpen(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <UserPlus className="w-4 h-4" /> Provision New User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <tr><th className="px-10 py-6">Staff Member</th><th className="px-10 py-6">Privilege Role</th><th className="px-10 py-6">Identity Tag</th><th className="px-10 py-6 text-right">Admin Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 group transition-all">
                    <td className="px-10 py-6 text-sm font-black text-slate-900">{user.name}</td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-slate-400">@{user.username}</td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                          {user.username !== 'admin' && (
                            <button onClick={() => removeUser(user.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><CreditCard className="w-6 h-6 text-emerald-600" /> Financial Gateways</h3>
              <div className="space-y-6">
                 <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">M-Pesa Paybill Number</label><input type="text" defaultValue="522522" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none" /></div>
                 <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">B2C Shortcode</label><input type="text" defaultValue="123456" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none" /></div>
                 <button className="w-full bg-emerald-50 text-emerald-700 py-4 rounded-2xl text-sm font-black border border-emerald-100 hover:bg-emerald-100 transition-colors">Test Daraja API Link</button>
              </div>
           </section>
           <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><MessageSquare className="w-6 h-6 text-emerald-600" /> Communications (SMS)</h3>
              <div className="space-y-6">
                 <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Global Sender ID</label><input type="text" defaultValue="ELIMUSMART" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none" /></div>
                 <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Automatic Fee Receipts</span>
                    <div className="w-12 h-7 bg-emerald-500 rounded-full relative flex items-center px-1"><div className="w-5 h-5 bg-white rounded-full shadow-sm"></div></div>
                 </div>
              </div>
           </section>
        </div>
      )}

      {/* Provision New User Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsProvisionModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-md:max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <UserCircle className="w-7 h-7 text-emerald-400" />
                <h3 className="text-2xl font-black uppercase">Staff Account</h3>
              </div>
              <button onClick={() => setIsProvisionModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleProvisionUser} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Legal Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Identity (Username)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-9 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="username"
                    value={newUser.username}
                    onChange={e => setNewUser({...newUser, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Access Privilege Level</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.CLASS_TEACHER}>Class Teacher</option>
                  <option value={UserRole.SUBJECT_TEACHER}>Subject Teacher</option>
                  <option value={UserRole.BURSAR}>School Bursar</option>
                  <option value={UserRole.ADMIN}>System Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsProvisionModalOpen(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
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
           {isSaving ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" /> 
               Synchronizing...
             </>
           ) : (
             <>
               <CheckCircle className="w-5 h-5" /> Commit System Updates
             </>
           )}
         </button>
      </div>
    </div>
  );
};

export default SettingsModule;
