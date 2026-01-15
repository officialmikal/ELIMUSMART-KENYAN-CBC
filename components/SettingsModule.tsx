
import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  BellRing, 
  MessageSquare, 
  CreditCard,
  UserPlus
} from 'lucide-react';

const SettingsModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
        <p className="text-slate-500">Configure your school profile, branding, and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* School Profile */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              School Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">School Name</label>
                <input type="text" defaultValue="Greenhill Academy" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sender ID (SMS)</label>
                <input type="text" defaultValue="GREENHILL" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <div className="flex items-center gap-4 pt-2">
                 <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    Logo
                 </div>
                 <button className="text-sm font-bold text-emerald-600 hover:underline">Change Logo</button>
              </div>
            </div>
          </section>

          {/* User Management */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Staff Accounts
              </span>
              <button className="text-emerald-600 text-xs flex items-center gap-1 hover:underline">
                <UserPlus className="w-3 h-3" /> Add User
              </button>
            </h3>
            <div className="divide-y divide-slate-100">
              {[
                { name: 'Admin User', role: 'Admin', email: 'admin@school.com' },
                { name: 'Joseph M.', role: 'Class Teacher', email: 'joseph@school.com' },
                { name: 'Mary Otieno', role: 'Bursar', email: 'mary@school.com' },
              ].map((user, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 font-medium text-xs">Edit</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Messaging Config */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              Auto-Messaging
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700">Fee Payment Alerts</div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700">Exam Result Alerts</div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                   <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700">Attendance Alerts</div>
                <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                   <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Config */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              M-Pesa Integration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Paybill Number</label>
                <input type="text" defaultValue="522522" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Account Prefix</label>
                <input type="text" defaultValue="STUDENT-" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <button className="w-full bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors">
                Test Connection
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
         <button className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
         <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md">Save Changes</button>
      </div>
    </div>
  );
};

export default SettingsModule;
