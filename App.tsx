
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Users, PenTool, FileText, Banknote, BarChart3, 
  MessageSquare, Settings, LogOut, Menu, X, Bell, UserCircle, Lock
} from 'lucide-react';
import { UserRole, User } from './types';
import Dashboard from './components/Dashboard';
import StudentsModule from './components/StudentsModule';
import MarksEntryModule from './components/MarksEntryModule';
import FinanceModule from './components/FinanceModule';
import MessagingModule from './components/MessagingModule';
import AnalyticsModule from './components/AnalyticsModule';
import SettingsModule from './components/SettingsModule';
import ReportsModule from './components/ReportsModule';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock login logic
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setCurrentUser({ username: 'admin', role: UserRole.ADMIN, name: 'School Admin' });
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Hint: admin / admin123');
    }
  };

  const menuItems = useMemo(() => {
    if (!currentUser) return [];
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
    return items.filter(item => item.roles.includes(currentUser.role));
  }, [currentUser]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-500">
          <div className="bg-emerald-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
              <span className="text-emerald-600 font-black text-3xl">E</span>
            </div>
            <h1 className="text-2xl font-bold">ElimuSmart Kenya</h1>
            <p className="text-emerald-100 text-sm mt-1">School Management Portal</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Sign In to System
            </button>
            <p className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Authorized Personnel Only</p>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const role = currentUser?.role || UserRole.NONE;
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} userRole={role} />;
      case 'students': return <StudentsModule userRole={role} />;
      case 'marks': return <MarksEntryModule userRole={role} />;
      case 'reports': return <ReportsModule />;
      case 'finance': return <FinanceModule />;
      case 'messaging': return <MessagingModule />;
      case 'analytics': return <AnalyticsModule />;
      case 'settings': return <SettingsModule />;
      default: return <Dashboard onNavigate={setActiveTab} userRole={role} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed lg:static lg:translate-x-0 z-50 w-64 h-full bg-emerald-900 text-white transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between p-6 border-b border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-emerald-900 font-bold text-lg">E</span>
            </div>
            <h1 className="font-bold text-lg">ElimuSmart</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-emerald-200"><X className="w-6 h-6" /></button>
        </div>

        <nav className="p-4 space-y-1 h-[calc(100%-180px)] overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-emerald-700 text-white font-medium shadow-sm' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-800/50 bg-emerald-950/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold">{currentUser?.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
              <p className="text-xs text-emerald-300 truncate capitalize">{currentUser?.role.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-2 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu className="w-6 h-6" /></button>
             <h2 className="font-semibold text-slate-800 capitalize truncate">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"><Bell className="w-5 h-5" /></button>
            <div className="hidden sm:block text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-full text-slate-600">2024 Academic Year</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
