
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PenTool, 
  FileText, 
  Banknote, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  UserCircle
} from 'lucide-react';
import { UserRole } from './types';
import Dashboard from './components/Dashboard';
import StudentsModule from './components/StudentsModule';
import MarksEntryModule from './components/MarksEntryModule';
import FinanceModule from './components/FinanceModule';
import MessagingModule from './components/MessagingModule';
import AnalyticsModule from './components/AnalyticsModule';
import SettingsModule from './components/SettingsModule';
import ReportsModule from './components/ReportsModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.CLASS_TEACHER, UserRole.SUBJECT_TEACHER, UserRole.BURSAR] },
      { id: 'students', label: 'Students', icon: Users, roles: [UserRole.ADMIN, UserRole.CLASS_TEACHER, UserRole.BURSAR] },
      { id: 'marks', label: 'Marks Entry', icon: PenTool, roles: [UserRole.ADMIN, UserRole.CLASS_TEACHER, UserRole.SUBJECT_TEACHER] },
      { id: 'reports', label: 'Reports', icon: FileText, roles: [UserRole.ADMIN, UserRole.CLASS_TEACHER] },
      { id: 'finance', label: 'Finance', icon: Banknote, roles: [UserRole.ADMIN, UserRole.BURSAR] },
      { id: 'messaging', label: 'Messaging', icon: MessageSquare, roles: [UserRole.ADMIN, UserRole.BURSAR] },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: [UserRole.ADMIN] },
      { id: 'settings', label: 'Settings', icon: Settings, roles: [UserRole.ADMIN] },
    ];
    return items.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const renderContent = () => {
    if (userRole === UserRole.NONE) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="bg-amber-50 border border-amber-200 p-8 rounded-xl max-w-md text-center shadow-sm">
            <UserCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-800 mb-2">No Role Assigned</h2>
            <p className="text-amber-700">Your account has no assigned roles yet. Please contact the administrator to assign you a role (Admin, Class Teacher, Subject Teacher, Bursar).</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} userRole={userRole} />;
      case 'students': return <StudentsModule />;
      case 'marks': return <MarksEntryModule />;
      case 'reports': return <ReportsModule />;
      case 'finance': return <FinanceModule />;
      case 'messaging': return <MessagingModule />;
      case 'analytics': return <AnalyticsModule />;
      case 'settings': return <SettingsModule />;
      default: return <Dashboard onNavigate={setActiveTab} userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg z-50"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed lg:static lg:translate-x-0 z-40 w-64 h-full bg-emerald-900 text-white transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between p-6 border-b border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-emerald-900 font-bold text-lg">E</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight">ElimuSmart</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === item.id ? 'bg-emerald-700 text-white font-medium' : 'text-emerald-100 hover:bg-emerald-800/50'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-800/50 bg-emerald-950/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold">
              {userRole.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Mwalimu Joseph</p>
              <p className="text-xs text-emerald-300 truncate capitalize">{userRole.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
          
          <select 
            className="w-full bg-emerald-800 text-white text-xs p-2 rounded mb-4 border-none focus:ring-1 focus:ring-emerald-400"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <button className="w-full flex items-center gap-3 px-4 py-2 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500">
                <Menu className="w-6 h-6" />
             </button>
             <h2 className="font-semibold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Term 1, 2024</span>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-500">JS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
