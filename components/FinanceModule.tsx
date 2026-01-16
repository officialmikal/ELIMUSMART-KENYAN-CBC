
import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, Search, Download, Printer, Send, CheckCircle2, AlertCircle,
  Clock, Banknote, FileText, X, ChevronRight, Hash, CreditCard, Receipt,
  Eye, Trash2, Filter, Wallet, Building, Smartphone, Edit3, Settings, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Users, Loader2, ShieldCheck, FileUp
} from 'lucide-react';
import { GRADES, YEARS } from '../constants';
import { Invoice, Student, Payment } from '../types';
import Papa from 'papaparse';

interface FeeStructureItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface FinanceModuleProps {
  students: Student[];
  setStudents?: React.Dispatch<React.SetStateAction<Student[]>>;
  privacyMode?: boolean;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ students, setStudents, privacyMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'payments' | 'structure'>('invoices');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isBulkBillModalOpen, setIsBulkBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentLedger, setSelectedStudentLedger] = useState<Student | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [processingPayment, setProcessingPayment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [feeItems, setFeeItems] = useState<FeeStructureItem[]>([
    { id: '1', name: 'Tuition Fee (PP1-PP2)', amount: 8500, category: 'Tuition' },
    { id: '2', name: 'Tuition Fee (Grade 1-6)', amount: 12000, category: 'Tuition' },
    { id: '3', name: 'Tuition Fee (JSS)', amount: 15500, category: 'Tuition' },
    { id: '4', name: 'Lunch Program', amount: 4500, category: 'Auxiliary' },
    { id: '5', name: 'School Transport (Zone A)', amount: 6000, category: 'Transport' },
    { id: '6', name: 'Activity Fee', amount: 1500, category: 'Other' },
  ]);

  const [payments, setPayments] = useState<Payment[]>([]);

  const stats = useMemo(() => {
    const totalOwed = students.reduce((acc, curr) => acc + curr.feeBalance, 0);
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const target = totalOwed + totalCollected;
    const efficiency = target > 0 ? (totalCollected / target) * 100 : 0;
    return { totalOwed, totalCollected, efficiency };
  }, [students, payments]);

  const maskValue = (val: string | number) => {
    if (!privacyMode) return `KES ${Number(val).toLocaleString()}`;
    return 'KES ••••••';
  };

  const dynamicInvoices = useMemo(() => {
    return students.filter(s => s.feeBalance > 0).map(student => ({
      id: `dyn-${student.id}`,
      invoiceNo: `INV/${student.admNo}`,
      studentId: student.id,
      studentName: student.name,
      admNo: student.admNo,
      grade: student.grade,
      term: 'Term 1',
      year: 2024,
      totalAmount: student.feeBalance,
      status: 'Partial'
    }));
  }, [students]);

  const filteredInvoices = dynamicInvoices.filter(inv => {
    const matchesSearch = inv.studentName.toLowerCase().includes(invoiceSearch.toLowerCase()) || 
                          inv.admNo.includes(invoiceSearch);
    const matchesGrade = gradeFilter === 'All' || inv.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleBulkPaymentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingPayment(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const paymentRows = results.data as any[];
        
        if (setStudents) {
          setStudents(prevStudents => {
            const updated = [...prevStudents];
            paymentRows.forEach(row => {
              const adm = row.ADM || row.admNo;
              const amount = Number(row.Amount || row.amount || 0);
              const studentIdx = updated.findIndex(s => s.admNo === adm);
              
              if (studentIdx >= 0 && amount > 0) {
                updated[studentIdx].feeBalance = Math.max(0, updated[studentIdx].feeBalance - amount);
                
                // Add to internal payments history
                const newPayment: Payment = {
                  id: Date.now().toString() + Math.random(),
                  receiptNo: row.Receipt || row.receiptNo || `RCPT-${Math.floor(Math.random() * 100000)}`,
                  invoiceId: `dyn-${updated[studentIdx].id}`,
                  studentId: updated[studentIdx].id,
                  amount: amount,
                  method: (row.Method || row.method || 'M-Pesa') as any,
                  reference: row.Ref || row.reference || 'Excel Import',
                  date: new Date().toISOString()
                };
                setPayments(p => [newPayment, ...p]);
              }
            });
            return updated;
          });
        }
        setProcessingPayment(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: () => setProcessingPayment(false)
    });
  };

  const handleExportLedger = () => {
    const dataToExport = students.map(s => ({
      'ADM': s.admNo,
      'Learner Name': s.name,
      'Grade': s.grade,
      'Stream': s.stream,
      'Phone': s.parentPhone,
      'Outstanding Balance (KES)': s.feeBalance
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Finance_Ledger_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-12">
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleBulkPaymentUpload} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Finance Control Center</h2>
          <p className="text-sm text-slate-500 font-medium">Bursar & Accounts Management Port</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button onClick={handleExportLedger} className="flex-1 sm:flex-none justify-center bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
            <Download className="w-4 h-4" /> Download Ledger
          </button>
           <button onClick={() => fileInputRef.current?.click()} disabled={processingPayment} className="flex-1 sm:flex-none justify-center bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
            {processingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            {processingPayment ? 'Importing...' : 'Upload Payments'}
          </button>
           <button onClick={() => setIsPaymentModalOpen(true)} className="flex-1 sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center gap-2">
            <Banknote className="w-5 h-5" /> Pay Fees
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
              <h4 className={`text-2xl font-black text-slate-900 transition-all ${privacyMode ? 'blur-[8px]' : ''}`}>{maskValue(stats.totalOwed)}</h4>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><ArrowUpRight className="w-6 h-6" /></div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Term Collection</p>
              <h4 className={`text-2xl font-black text-emerald-600 transition-all ${privacyMode ? 'blur-[8px]' : ''}`}>{maskValue(stats.totalCollected)}</h4>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><ArrowDownRight className="w-6 h-6" /></div>
         </div>
         <div className="bg-emerald-600 p-6 rounded-[32px] text-white flex items-center justify-between shadow-xl shadow-emerald-100">
            <div>
              <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Collection Efficiency</p>
              <h4 className="text-2xl font-black">{stats.efficiency.toFixed(1)}%</h4>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
         </div>
      </div>

      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-slate-100 bg-slate-50/20">
             <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Find by Learner Name or ADM..." className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none" value={invoiceSearch} onChange={(e) => setInvoiceSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <select className="bg-white border border-slate-200 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest outline-none" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
                <option value="All">All Grades</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {privacyMode && (
                <div className="bg-slate-900 text-emerald-400 px-4 py-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg">
                  <ShieldCheck className="w-4 h-4" /> Stealth
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <tr><th className="px-8 py-5">Ref / ADM</th><th className="px-8 py-5">Learner Profile</th><th className="px-8 py-5 text-right">Outstanding Balance</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 group transition-all">
                    <td className="px-8 py-5">
                      <p className="text-xs font-black text-slate-900">{inv.invoiceNo}</p>
                      <p className="text-[10px] font-bold text-slate-400">ADM: {inv.admNo}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-slate-900">{inv.studentName}</p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{inv.grade}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className={`text-sm font-black text-slate-900 transition-all ${privacyMode ? 'blur-[5px]' : ''}`}>{maskValue(inv.totalAmount)}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{inv.status}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-1">
                          <button onClick={() => setSelectedStudentLedger(students.find(s => s.id === inv.studentId) || null)} className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
