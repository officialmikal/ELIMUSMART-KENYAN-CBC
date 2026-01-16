
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, Users, PenTool, FileText, Banknote, BarChart3, 
  MessageSquare, Settings, LogOut, Menu, X, Bell, Lock, Download, 
  Share, Smartphone, ShieldCheck, ShieldAlert, Eye, EyeOff, Loader2
} from 'lucide-react';
import { UserRole, User, Student, SecuritySettings, Subject, Payment } from './types';
import { MOCK_STUDENTS, INITIAL_SUBJECTS } from './constants';
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
  const [isLocked, setIsLocked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Security States
  const [security, setSecurity] = useState<SecuritySettings>({
    privacyMode: false,
    sessionTimeout: 15,
    twoFactorEnabled: false,
    strictMode: false
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

  // Global State
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [marks, setMarks] = useState<Record<string, Record<string, { score: string; remark: string }>>>({});
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // 1. Session Inactivity Monitor
  useEffect(() => {
    if (!isLoggedIn || isLocked) return;
    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsLocked(true), security.sessionTimeout * 60 * 1000);
    };
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [isLoggedIn, isLocked, security.sessionTimeout]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginDisabled) return;
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setCurrentUser({ username: 'admin', role: UserRole.ADMIN, name: 'School Admin' });
      setIsLoggedIn(true);
      setIsLocked(false);
      setLoginError('');
      setLoginAttempts(0);
    } else {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if (attempts >= 3) {
        setIsLoginDisabled(true);
        setLoginError('Security Lock: Too many failed attempts.');
        setTimeout(() => { setIsLoginDisabled(false); setLoginAttempts(0); setLoginError(''); }, 60000);
      } else {
        setLoginError(`Invalid credentials (${3 - attempts} attempts remaining).`);
      }
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

  const renderContent = () => {
    const role = currentUser?.role || UserRole.NONE;
    const commonProps = { privacyMode: security.privacyMode };

    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} userRole={role} studentsCount={students.length} />;
      case 'students': return <StudentsModule userRole={role} students={students} setStudents={setStudents} {...commonProps} />;
      case 'marks': return <MarksEntryModule userRole={role} students={students} marks={marks} setMarks={setMarks} />;
      case 'reports': return <ReportsModule students={students} marks={marks} />;
      case 'finance': return <FinanceModule students={students} setStudents={setStudents} payments={payments} setPayments={setPayments} {...commonProps} />;
      case 'messaging': return <MessagingModule students={students} {...commonProps} />;
      case 'analytics': return <AnalyticsModule students={students} />;
      case 'settings': return <SettingsModule security={security} setSecurity={setSecurity} subjects={subjects} setSubjects={setSubjects} />;
      default: return <Dashboard onNavigate={setActiveTab} userRole={role} studentsCount={students.length} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-inter">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-white/20">
          <div className="bg-slate-900 p-10 text-white text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-600 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight">ElimuSmart Secure</h1>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">Institutional Gateway</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="p-10 space-y-6">
            <div className="space-y-4">
              <input type="text" placeholder="Institutional ID" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} required />
              <input type="password" placeholder="Access PIN" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} required />
            </div>
            {loginError && <p className="text-red-600 text-[10px] font-black uppercase bg-red-50 p-3 rounded-xl">{loginError}</p>}
            <button className="w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all active:scale-95">Decrypt & Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      <aside className={`fixed lg:static z-50 w-64 h-full bg-emerald-950 text-white transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-emerald-900/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <h1 className="font-black text-lg uppercase tracking-tight">ElimuSmart</h1>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/40' : 'text-emerald-100/60 hover:text-white hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-900/30 bg-black/20">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest"><LogOut className="w-4 h-4" /> End Session</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu className="w-6 h-6" /></button>
          <div className="flex items-center gap-4">
             <h2 className="font-black text-slate-900 uppercase tracking-tight truncate text-lg">{activeTab.replace('-', ' ')}</h2>
          </div>
          <button onClick={() => setSecurity(s => ({ ...s, privacyMode: !s.privacyMode }))} className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${security.privacyMode ? 'bg-slate-900 text-emerald-400' : 'bg-slate-50 text-slate-400'}`}>
            {security.privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-10">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
