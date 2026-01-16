
import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, Search, Download, Printer, Send, CheckCircle2, AlertCircle,
  Clock, Banknote, FileText, X, ChevronRight, Hash, CreditCard, Receipt as ReceiptIcon,
  Eye, Trash2, Filter, Wallet, Building, Smartphone, Edit3, Settings, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Users, Loader2, ShieldCheck, FileUp, Sparkles, AlertTriangle
} from 'lucide-react';
import { GRADES } from '../constants';
import { Student, Payment } from '../types';
import Papa from 'papaparse';

interface FinanceModuleProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  privacyMode?: boolean;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ students, setStudents, payments, setPayments, privacyMode }) => {
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal States
  const [isBulkBillModalOpen, setIsBulkBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [selectedStatementStudent, setSelectedStatementStudent] = useState<Student | null>(null);

  // Form States
  const [bulkGrade, setBulkGrade] = useState('PP1');
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkReason, setBulkReason] = useState('Term 1 Tuition');

  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    amount: '',
    method: 'M-Pesa' as 'M-Pesa' | 'Cash' | 'Bank',
    reference: ''
  });

  const stats = useMemo(() => {
    const totalOwed = students.reduce((acc, curr) => acc + curr.feeBalance, 0);
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const target = totalOwed + totalCollected;
    const efficiency = target > 0 ? (totalCollected / target) * 100 : 0;
    return { totalOwed, totalCollected, efficiency };
  }, [students, payments]);

  const handleBulkBill = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const billAmount = Number(bulkAmount);
    
    setTimeout(() => {
      setStudents(prev => prev.map(student => {
        if (student.grade === bulkGrade) {
          return { ...student, feeBalance: student.feeBalance + billAmount };
        }
        return student;
      }));
      setIsProcessing(false);
      setIsBulkBillModalOpen(false);
      setBulkAmount('');
    }, 1000);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(paymentForm.amount);
    if (!paymentForm.studentId || amt <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const student = students.find(s => s.id === paymentForm.studentId);
      if (!student) return;

      const newPayment: Payment = {
        id: Date.now().toString(),
        receiptNo: `RCPT-${Math.floor(100000 + Math.random() * 900000)}`,
        invoiceId: `INV-${student.admNo}`,
        studentId: student.id,
        amount: amt,
        method: paymentForm.method,
        reference: paymentForm.reference || 'Regular Fee Payment',
        date: new Date().toISOString()
      };

      setPayments(prev => [newPayment, ...prev]);
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, feeBalance: Math.max(0, s.feeBalance - amt) } : s));
      
      setIsProcessing(false);
      setIsPaymentModalOpen(false);
      setPaymentForm({ studentId: '', amount: '', method: 'M-Pesa', reference: '' });
      setSelectedReceipt(newPayment);
    }, 1000);
  };

  const handleExportLedger = () => {
    const data = students.map(s => ({ 'ADM': s.admNo, 'Name': s.name, 'Grade': s.grade, 'Balance': s.feeBalance }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `Ledger_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const filteredInvoices = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(invoiceSearch.toLowerCase()) || s.admNo.includes(invoiceSearch);
    const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Financial Terminal</h2>
          <p className="text-sm text-slate-500 font-medium italic">Institutional collection and billing engine</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button onClick={() => setIsBulkBillModalOpen(true)} className="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 flex items-center gap-2 transition-all">
            <Sparkles className="w-4 h-4" /> Bulk Bill
          </button>
           <button onClick={() => setIsPaymentModalOpen(true)} className="flex-1 sm:flex-none bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 flex items-center gap-2 shadow-xl shadow-emerald-100 transition-all">
            <Plus className="w-4 h-4" /> Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Outstanding</p>
              <h4 className={`text-2xl font-black text-slate-900 ${privacyMode ? 'blur-md' : ''}`}>KES {stats.totalOwed.toLocaleString()}</h4>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><ArrowUpRight className="w-6 h-6" /></div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Collected</p>
              <h4 className={`text-2xl font-black text-emerald-600 ${privacyMode ? 'blur-md' : ''}`}>KES {stats.totalCollected.toLocaleString()}</h4>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><ArrowDownRight className="w-6 h-6" /></div>
         </div>
         <div className="bg-slate-900 p-6 rounded-[32px] text-white flex items-center justify-between shadow-xl">
            <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Efficiency Ratio</p>
              <h4 className="text-2xl font-black">{stats.efficiency.toFixed(1)}%</h4>
            </div>
            <button onClick={handleExportLedger} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors"><Download className="w-6 h-6" /></button>
         </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50/50 flex flex-col md:flex-row gap-4 border-b border-slate-100">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search by Learner Name or ADM..." className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-xs font-black outline-none transition-all focus:ring-2 focus:ring-emerald-500" value={invoiceSearch} onChange={(e) => setInvoiceSearch(e.target.value)} />
           </div>
           <select className="bg-white border border-slate-200 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
             <option value="All">All Grades</option>
             {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
           </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr><th className="px-10 py-6">Learner Profile</th><th className="px-10 py-6">Reference</th><th className="px-10 py-6 text-right">Fee Balance</th><th className="px-10 py-6 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-slate-900">{s.name}</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{s.grade}</p>
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-slate-400 uppercase">ADM: {s.admNo}</td>
                  <td className="px-10 py-6 text-right"><p className={`text-sm font-black text-slate-900 ${privacyMode ? 'blur-md' : ''}`}>KES {s.feeBalance.toLocaleString()}</p></td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setSelectedStatementStudent(s)} className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all" title="View Detailed Statement"><FileText className="w-4 h-4" /></button>
                       <button onClick={() => window.print()} className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-xl transition-all" title="Print Professional Fee Demand"><Printer className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isProcessing && setIsPaymentModalOpen(false)} />
           <form onSubmit={handleRecordPayment} className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95">
              <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Post Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">1. Target Learner</label>
                  <select required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none" value={paymentForm.studentId} onChange={e => setPaymentForm({...paymentForm, studentId: e.target.value})}>
                    <option value="">Select Student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admNo})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">2. Payment Value (KES)</label>
                  <input type="number" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg font-black outline-none" placeholder="0.00" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">3. Financial Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['M-Pesa', 'Cash', 'Bank'].map(m => (
                      <button key={m} type="button" onClick={() => setPaymentForm({...paymentForm, method: m as any})} className={`py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${paymentForm.method === m ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">4. Transaction Identifier</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none" placeholder="SBL23XJ9..." value={paymentForm.reference} onChange={e => setPaymentForm({...paymentForm, reference: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={isProcessing} className="w-full mt-8 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95">
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Authorize & Post
              </button>
           </form>
        </div>
      )}

      {/* Bulk Billing Grade Modal */}
      {isBulkBillModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isProcessing && setIsBulkBillModalOpen(false)} />
           <form onSubmit={handleBulkBill} className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95">
              <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Grade-Wide Invoicing</h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">A. Select Target Grade</label>
                    <select value={bulkGrade} onChange={e => setBulkGrade(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none">
                       {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">B. Assessment Value (KES)</label>
                    <input type="number" required value={bulkAmount} onChange={e => setBulkAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-lg font-black outline-none" placeholder="0.00" />
                 </div>
              </div>
              <button type="submit" disabled={isProcessing} className="w-full mt-8 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-black transition-all">
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Grade Charges'}
              </button>
           </form>
        </div>
      )}

      {/* Professional Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedReceipt(null)} />
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 relative z-10 animate-in zoom-in-95 print:p-0 print:shadow-none">
              <div className="text-center space-y-4 mb-8">
                 <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg"><ReceiptIcon className="w-8 h-8" /></div>
                 <h3 className="text-2xl font-black uppercase tracking-tight">Greenhill Academy</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Payment Receipt</p>
              </div>
              <div className="space-y-4 border-y border-slate-100 py-8">
                 <div className="flex justify-between text-xs font-black uppercase text-slate-400"><span>Receipt No:</span><span className="text-slate-900">{selectedReceipt.receiptNo}</span></div>
                 <div className="flex justify-between text-xs font-black uppercase text-slate-400"><span>Date:</span><span className="text-slate-900">{new Date(selectedReceipt.date).toLocaleDateString()}</span></div>
                 <div className="flex justify-between text-xs font-black uppercase text-slate-400"><span>Learner Identity:</span><span className="text-slate-900">{students.find(s => s.id === selectedReceipt.studentId)?.name}</span></div>
                 <div className="flex justify-between text-xs font-black uppercase text-slate-400"><span>Admission Ref:</span><span className="text-slate-900">{students.find(s => s.id === selectedReceipt.studentId)?.admNo}</span></div>
                 <div className="flex justify-between text-xs font-black uppercase text-slate-400"><span>Financial Channel:</span><span className="text-slate-900">{selectedReceipt.method}</span></div>
                 <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-50">
                    <span className="text-sm font-black uppercase text-emerald-600">Total Validated</span>
                    <span className="text-2xl font-black text-slate-900">KES {selectedReceipt.amount.toLocaleString()}</span>
                 </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 print:hidden">
                 <button onClick={() => setSelectedReceipt(null)} className="py-4 text-slate-400 font-black text-xs uppercase">Discard View</button>
                 <button onClick={() => window.print()} className="py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-black transition-all">
                   <Printer className="w-4 h-4" /> Print Receipt
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Comprehensive Statement Preview Modal */}
      {selectedStatementStudent && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedStatementStudent(null)} />
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl p-12 relative z-10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-start mb-10">
                 <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight">Greenhill Academy</h3>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Cumulative Statement of Account</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">As At</p>
                   <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString()}</p>
                 </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-[32px] grid grid-cols-2 gap-8 mb-10 border border-slate-100">
                 <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Learner Particulars</p><p className="text-sm font-black text-slate-900">{selectedStatementStudent.name}</p></div>
                 <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Admission Number</p><p className="text-sm font-black text-slate-900">{selectedStatementStudent.admNo}</p></div>
                 <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grade Designation</p><p className="text-sm font-black text-slate-900">{selectedStatementStudent.grade}</p></div>
                 <div><p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Current Arrears</p><p className="text-sm font-black text-emerald-700">KES {selectedStatementStudent.feeBalance.toLocaleString()}</p></div>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Institutional Payment Ledger</h4>
                 <div className="divide-y divide-slate-100 border border-slate-100 rounded-[24px] overflow-hidden">
                    {payments.filter(p => p.studentId === selectedStatementStudent.id).length > 0 ? (
                      payments.filter(p => p.studentId === selectedStatementStudent.id).map(p => (
                        <div key={p.id} className="flex justify-between p-5 hover:bg-slate-50/50 transition-colors">
                           <div>
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{p.receiptNo}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.method} • {new Date(p.date).toLocaleDateString()}</p>
                           </div>
                           <p className="text-sm font-black text-emerald-600">+ KES {p.amount.toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 text-center space-y-3">
                         <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200"><AlertCircle className="w-6 h-6" /></div>
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Zero verified payment history</p>
                      </div>
                    )}
                 </div>
              </div>
              <button onClick={() => window.print()} className="w-full mt-12 py-5 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-black transition-all">
                 <Printer className="w-5 h-5" /> Export PDF Statement
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
