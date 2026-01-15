
import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Banknote, 
  TrendingUp, 
  MessageSquare, 
  FileCheck,
  PlusCircle,
  Search,
  ArrowRight,
  Bell
} from 'lucide-react';
import { UserRole } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userRole }) => {
  const stats = [
    { label: 'Total Students', value: '842', icon: Users, color: 'bg-blue-500', trend: '+12 this month' },
    { label: 'Average Grade', value: 'B+', icon: GraduationCap, color: 'bg-purple-500', trend: 'Stable' },
    { label: 'Fees Collected', value: 'KES 2.4M', icon: Banknote, color: 'bg-emerald-500', trend: '82% of Target' },
    { label: 'Messages Sent', value: '1.2k', icon: MessageSquare, color: 'bg-orange-500', trend: '+150 today' },
  ];

  const quickActions = [
    { id: 'students', label: 'Add Student', icon: PlusCircle, roles: [UserRole.ADMIN, UserRole.BURSAR] },
    { id: 'marks', label: 'Marks Entry', icon: FileCheck, roles: [UserRole.ADMIN, UserRole.CLASS_TEACHER, UserRole.SUBJECT_TEACHER] },
    { id: 'messaging', label: 'Send SMS', icon: MessageSquare, roles: [UserRole.ADMIN, UserRole.BURSAR] },
    { id: 'finance', label: 'Record Fee', icon: Banknote, roles: [UserRole.ADMIN, UserRole.BURSAR] },
  ].filter(action => action.roles.includes(userRole));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search students, admissions, or receipts..."
          className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
                >
                  <action.icon className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Recent Activity</h3>
              <button className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { title: 'Fee Payment Received', detail: 'KES 45,000 - Adm No 1023 (Kevin Otieno)', time: '2 mins ago', type: 'finance' },
                { title: 'SMS Alert Sent', detail: 'Fee reminder to 12 parents (Grade 4)', time: '45 mins ago', type: 'message' },
                { title: 'Marks Submitted', detail: 'Social Studies - Grade 6 (Mwalimu Sarah)', time: '1 hour ago', type: 'marks' },
                { title: 'New Student Enrolled', detail: 'Brian Kimani - Adm No 1105', time: '3 hours ago', type: 'student' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === 'finance' ? 'bg-emerald-100 text-emerald-600' :
                    item.type === 'message' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'marks' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.type === 'finance' && <Banknote className="w-5 h-5" />}
                    {item.type === 'message' && <MessageSquare className="w-5 h-5" />}
                    {item.type === 'marks' && <FileCheck className="w-5 h-5" />}
                    {item.type === 'student' && <Users className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.detail}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">School Reopening</h4>
              <p className="text-emerald-100 text-sm mb-4">Term 2 begins in 5 days. Ensure all invoices are generated and sent to parents.</p>
              <button 
                onClick={() => onNavigate('messaging')}
                className="bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-50 transition-colors"
              >
                Send Reminders
              </button>
            </div>
            {/* Added missing Bell icon from lucide-react */}
            <Bell className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">Termly Target</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">Fee Collection</span>
                  <span className="font-bold text-slate-800">82%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">Reporting Progress</span>
                  <span className="font-bold text-slate-800">45%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">Attendance Rate</span>
                  <span className="font-bold text-slate-800">96%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
