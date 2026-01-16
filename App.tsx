
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Users, PenTool, FileText, Banknote, BarChart3, 
  MessageSquare, Settings, LogOut, Menu, X, Bell, Lock, Download, 
  Share, Smartphone, ShieldCheck, ShieldAlert, Eye, EyeOff, Loader2
} from 'lucide-react';
import { UserRole, User, Student, SecuritySettings } from './types';
import { MOCK_STUDENTS } from './constants';
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

  // PWA States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  // Global State
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [marks, setMarks] = useState<Record<string, Record<string, { score: string; remark: string }>>>({});
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // 1. Session Inactivity Monitor
  useEffect(() => {
    if (!isLoggedIn || isLocked) return;

    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsLocked(true);
      }, security.sessionTimeout * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [isLoggedIn, isLocked, security.sessionTimeout]);

  // 2. Brute Force Protection Logic
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
        setLoginError('Security Lock: Too many failed attempts. Try again in 60s.');
        setTimeout(() => {
          setIsLoginDisabled(false);
          setLoginAttempts(0);
          setLoginError('');
        }, 60000);
      } else {
        setLoginError(`Invalid credentials (${3 - attempts} attempts remaining).`);
      }
    }
  };

  // PWA Installation
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else {
      setShowIOSHint(true);
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
      case 'finance': return <FinanceModule students={students} {...commonProps} />;
      case 'messaging': return <MessagingModule students={students} {...commonProps} />;
      case 'analytics': return <AnalyticsModule students={students} />;
      case 'settings': return <SettingsModule security={security} setSecurity={setSecurity} />;
      default: return <Dashboard onNavigate={setActiveTab} userRole={role} studentsCount={students.length} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px]"></div>
        
        <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-white/20">
          <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-600 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight">ElimuSmart Secure</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Authenticated Gateway</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="p-10 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional ID</label>
                <input 
                  type="text" 
                  disabled={isLoginDisabled}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Access PIN / Password</label>
                <input 
                  type="password" 
                  disabled={isLoginDisabled}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
            </div>
            {loginError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-[10px] font-black uppercase tracking-tight">{loginError}</p>
              </div>
            )}
            <button 
              disabled={isLoginDisabled}
              className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                isLoginDisabled ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
              }`}
            >
              {isLoginDisabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              {isLoginDisabled ? 'Account Locked' : 'Decrypt & Login'}
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
               <ShieldCheck className="w-3 h-3 text-emerald-500" />
               AES-256 Cloud Encryption Active
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Session Lock Overlay
  if (isLocked) {
    return (
      <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-4">
         <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-900/40 border border-white/20">
               <Lock className="w-12 h-12 text-white" />
            </div>
            <div className="text-white">
               <h2 className="text-3xl font-black uppercase tracking-tight">System Locked</h2>
               <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-2">Session expired for your safety</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
               <p className="text-slate-400 text-sm font-medium">Hello <span className="text-white font-bold">{currentUser?.name}</span>, please enter your password to resume.</p>
               <input 
                 type="password" 
                 placeholder="Enter Password" 
                 className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 text-center text-white font-black outline-none focus:ring-2 focus:ring-emerald-500"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     // In a real app, verify password. For mock, just unlock.
                     setIsLocked(false);
                   }
                 }}
               />
               <div className="flex flex-col gap-3">
                 <button onClick={() => setIsLocked(false)} className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40">Resume Session</button>
                 <button onClick={() => setIsLoggedIn(false)} className="text-slate-500 font-black text-[10px] uppercase hover:text-white transition-colors">Sign out completely</button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed lg:static lg:translate-x-0 z-50 w-64 h-full bg-emerald-950 text-white transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between p-6 border-b border-emerald-900/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-black text-lg uppercase tracking-tight">ElimuSmart</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-emerald-200"><X className="w-6 h-6" /></button>
        </div>

        <nav className="p-4 space-y-1 h-[calc(100%-180px)] overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/40' : 'text-emerald-100/60 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-emerald-600'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-900/30 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold">{currentUser?.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-emerald-400 truncate uppercase font-black">{currentUser?.role}</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> End Session
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu className="w-6 h-6" /></button>
             <div>
               <h2 className="font-black text-slate-900 uppercase tracking-tight truncate text-lg">{activeTab.replace('-', ' ')}</h2>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Terminal
               </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Global Privacy Toggle */}
            <button 
              onClick={() => setSecurity(s => ({ ...s, privacyMode: !s.privacyMode }))}
              title={security.privacyMode ? "Disable Privacy Mode" : "Enable Privacy Mode"}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${security.privacyMode ? 'bg-slate-900 border-slate-900 text-emerald-400 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}
            >
              {security.privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">
                {security.privacyMode ? 'Stealth Active' : 'Privacy Mode'}
              </span>
            </button>

            <button className="p-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl relative hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          {renderContent()}
        </div>
      </main>

      {/* PWA INSTALLATION UI */}
      {(isInstallable || showIOSHint) && (
        <div className="fixed bottom-8 right-8 left-8 md:left-auto md:w-80 z-[300] animate-in slide-in-from-bottom-12 duration-500">
           <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                <Smartphone className="w-24 h-24" />
              </div>

              {!showIOSHint ? (
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center animate-pulse-soft">
                        <Download className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-tight">Install App</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Native Performance</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={handleInstallClick} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/40">Install Now</button>
                     <button onClick={() => setIsInstallable(false)} className="px-4 py-3 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white">Close</button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 space-y-5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-tight">iOS Setup</h4>
                    <button onClick={() => setShowIOSHint(false)} className="text-slate-500"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[11px] text-slate-300">Tap <Share className="w-3 h-3 inline"/> then <span className="text-emerald-500 font-bold">"Add to Home Screen"</span>.</p>
                  </div>
                  <button onClick={() => setShowIOSHint(false)} className="w-full bg-slate-800 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Done</button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
