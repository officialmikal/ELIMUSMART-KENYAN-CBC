
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Download, Printer, Send, CheckCircle2, AlertCircle,
  Clock, Banknote, FileText, X, ChevronRight, Hash, CreditCard, Receipt,
  Eye, Trash2, Filter, Wallet, Building, Smartphone, Edit3, Settings, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Users, Loader2
} from 'lucide-react';
import { GRADES, YEARS } from '../constants';
import { Invoice, Student, Payment } from '../types';

interface FeeStructureItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface FinanceModuleProps {
  students: Student[];
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ students }) => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'payments' | 'structure'>('invoices');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isBulkBillModalOpen, setIsBulkBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentLedger, setSelectedStudentLedger] = useState<Student | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Fee Structure State
  const [feeItems, setFeeItems] = useState<FeeStructureItem[]>([
    { id: '1', name: 'Tuition Fee (PP1-PP2)', amount: 8500, category: 'Tuition' },
    { id: '2', name: 'Tuition Fee (Grade 1-6)', amount: 12000, category: 'Tuition' },
    { id: '3', name: 'Tuition Fee (JSS)', amount: 15500, category: 'Tuition' },
    { id: '4', name: 'Lunch Program', amount: 4500, category: 'Auxiliary' },
    { id: '5', name: 'School Transport (Zone A)', amount: 6000, category: 'Transport' },
    { id: '6', name: 'Activity Fee', amount: 1500, category: 'Other' },
  ]);

  const [payments, setPayments] = useState<Payment[]>([]);

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    invoiceId: '',
    amount: '',
    method: 'M-Pesa' as 'M-Pesa' | 'Cash' | 'Bank',
    reference: ''
  });

  // Bulk Bill State
  const [bulkBillForm, setBulkBillForm] = useState({
    grade: 'PP1',
    stream: 'All',
    feeItemId: feeItems[0].id
  });

  // Financial Stats Calculation
  const stats = useMemo(() => {
    const totalOwed = students.reduce((acc, curr) => acc + curr.feeBalance, 0);
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const target = totalOwed + totalCollected;
    const efficiency = target > 0 ? (totalCollected / target) * 100 : 0;

    return { totalOwed, totalCollected, efficiency };
  }, [students, payments]);

  // Dynamically generated invoices from students with balances
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

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(paymentForm.amount);
    if (!amountNum || !paymentForm.invoiceId) return;

    setProcessingPayment(true);
    
    // Simulate STK Push or Bank Auth
    setTimeout(() => {
      const newPayment: Payment = {
        id: Date.now().toString(),
        receiptNo: `REC/${Math.floor(Math.random() * 9000) + 1000}`,
        invoiceId: paymentForm.invoiceId,
        studentId: paymentForm.studentId,
        amount: amountNum,
        method: paymentForm.method,
        reference: paymentForm.reference || (paymentForm.method === 'M-Pesa' ? 'R'+Math.random().toString(36).substr(2, 9).toUpperCase() : 'N/A'),
        date: new Date().toLocaleDateString()
      };
      setPayments([newPayment, ...payments]);
      setProcessingPayment(false);
      setIsPaymentModalOpen(false);
      setSelectedReceipt(newPayment); 
      setPaymentForm({ studentId: '', invoiceId: '', amount: '', method: 'M-Pesa', reference: '' });
    }, 2000);
  };

  const handleBulkInvoicing = () => {
    alert(`Bulk Invoicing triggered for ${bulkBillForm.grade} (${bulkBillForm.stream}). Learners billed for ${feeItems.find(f => f.id === bulkBillForm.feeItemId)?.name}`);
    setIsBulkBillModalOpen(false);
  };

  const handleSendSMS = (inv: any) => {
    const student = students.find(s => s.id === inv.studentId);
    alert(`SMS SENT: "Dear ${student?.parentName}, kindly clear the KES ${inv.totalAmount.toLocaleString()} balance for ${inv.studentName} (ADM:${inv.admNo}). Use Paybill 522522."`);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Finance Control Center</h2>
          <p className="text-sm text-slate-500 font-medium">Bursar & Accounts Management Port</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button 
             onClick={() => setIsBulkBillModalOpen(true)}
             className="flex-1 sm:flex-none justify-center bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2"
           >
            <Plus className="w-4 h-4" /> Bulk Bill
          </button>
           <button 
             onClick={() => setIsPaymentModalOpen(true)}
             className="flex-1 sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center gap-2"
           >
            <Banknote className="w-5 h-5" /> Pay Fees
          </button>
        </div>
      </div>

      {/* Financial Health Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
              <h4 className="text-2xl font-black text-slate-900">KES {stats.totalOwed.toLocaleString()}</h4>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
               <ArrowUpRight className="w-6 h-6" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Term Collection</p>
              <h4 className="text-2xl font-black text-emerald-600">KES {stats.totalCollected.toLocaleString()}</h4>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
               <ArrowDownRight className="w-6 h-6" />
            </div>
         </div>
         <div className="bg-emerald-600 p-6 rounded-[32px] text-white flex items-center justify-between shadow-xl shadow-emerald-100">
            <div>
              <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Collection Efficiency</p>
              <h4 className="text-2xl font-black">{stats.efficiency.toFixed(1)}%</h4>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
               <TrendingUp className="w-6 h-6" />
            </div>
         </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto no-scrollbar pt-4">
        {[
          { id: 'invoices', label: 'Learner Invoices', icon: Receipt },
          { id: 'payments', label: 'Payment Logs', icon: Clock },
          { id: 'structure', label: 'Fee Schedules', icon: Wallet }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${activeSubTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {activeSubTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find by Learner Name or ADM..." 
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
              />
            </div>
            <select 
              className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="All">All Grades</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <tr><th className="px-8 py-5">Ref / ADM</th><th className="px-8 py-5">Learner Profile</th><th className="px-8 py-5 text-right">Outstanding Balance</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
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
                      <p className="text-sm font-black text-slate-900">KES {inv.totalAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-1">
                          <button onClick={() => setSelectedStudentLedger(students.find(s => s.id === inv.studentId) || null)} className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-xl transition-all" title="View Statement"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleSendSMS(inv)} className="p-3 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-xl transition-all" title="Send SMS Reminder"><Send className="w-4 h-4" /></button>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">No outstanding invoices found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History Subtab */}
      {activeSubTab === 'payments' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <tr><th className="px-8 py-5">Receipt #</th><th className="px-8 py-5">Learner Name</th><th className="px-8 py-5 text-right">Amount Cleared</th><th className="px-8 py-5">Channel</th><th className="px-8 py-5 text-right">Action</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {payments.length === 0 ? (
                   <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No payments recorded in this session</td></tr>
                 ) : (
                   payments.map(pay => (
                     <tr key={pay.id} className="hover:bg-slate-50/50 transition-all group">
                       <td className="px-8 py-5">
                          <p className="text-xs font-black text-slate-900">{pay.receiptNo}</p>
                          <p className="text-[10px] font-bold text-slate-400">{pay.date}</p>
                       </td>
                       <td className="px-8 py-5 text-sm font-bold text-slate-700">{students.find(s => s.id === pay.studentId)?.name}</td>
                       <td className="px-8 py-5 text-right text-sm font-black text-emerald-600">KES {pay.amount.toLocaleString()}</td>
                       <td className="px-8 py-5">
                          <span className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                             {pay.method === 'M-Pesa' && <Smartphone className="w-3.5 h-3.5 text-emerald-500" />}
                             {pay.method === 'Bank' && <Building className="w-3.5 h-3.5 text-blue-500" />}
                             {pay.method === 'Cash' && <Wallet className="w-3.5 h-3.5 text-amber-500" />}
                             {pay.method}
                          </span>
                        </td>
                       <td className="px-8 py-5 text-right">
                          <button onClick={() => setSelectedReceipt(pay)} className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-xl transition-all">
                             <Printer className="w-4 h-4" />
                          </button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* Fee Structure Subtab */}
      {activeSubTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
           {feeItems.map((item) => (
             <div key={item.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                      <Receipt className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" />
                   </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-300 hover:text-emerald-600"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-300 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
                <h5 className="font-black text-slate-900 text-base mb-1">{item.name}</h5>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{item.category}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <p className="text-2xl font-black text-emerald-600">KES {item.amount.toLocaleString()}</p>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Per Term</span>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* MODAL: Record Payment */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !processingPayment && setIsPaymentModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <Banknote className="w-7 h-7" />
                 <h3 className="text-xl font-bold uppercase tracking-tight">Financial Receipting</h3>
               </div>
               {!processingPayment && <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-6 h-6" /></button>}
            </div>
            
            {processingPayment ? (
              <div className="p-20 text-center space-y-6">
                 <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase">Processing Payment...</h4>
                    <p className="text-sm text-slate-500 font-bold">Waiting for M-Pesa STK Confirmation</p>
                 </div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest animate-pulse">Communicating with Gateway</p>
              </div>
            ) : (
              <form onSubmit={handleRecordPayment} className="p-10 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">1. Select Learner & Outstanding Bill</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    value={paymentForm.invoiceId}
                    onChange={e => {
                      const inv = dynamicInvoices.find(i => i.id === e.target.value);
                      setPaymentForm({...paymentForm, invoiceId: e.target.value, studentId: inv?.studentId || ''});
                    }}
                  >
                    <option value="">Search Outstanding Balances...</option>
                    {dynamicInvoices.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.studentName} (Bal: {inv.totalAmount.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">2. Choose Payment Channel</label>
                  <div className="flex gap-2">
                      {[
                        { id: 'M-Pesa', icon: Smartphone },
                        { id: 'Bank', icon: Building },
                        { id: 'Cash', icon: Wallet }
                      ].map(m => (
                        <button 
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentForm({...paymentForm, method: m.id as any})}
                          className={`flex-1 p-5 rounded-2xl border-2 font-black text-xs flex flex-col items-center gap-3 transition-all ${paymentForm.method === m.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          <m.icon className="w-6 h-6" /> {m.id}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">3. Amount (KES)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-black text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500" 
                      value={paymentForm.amount}
                      onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">4. Trans. Ref ID</label>
                    <input 
                      type="text" 
                      required={paymentForm.method !== 'Cash'}
                      placeholder={paymentForm.method === 'M-Pesa' ? 'STK Auto-ID' : 'Ref ID'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                      value={paymentForm.reference}
                      onChange={e => setPaymentForm({...paymentForm, reference: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">Complete Transaction</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Bulk Billing */}
      {isBulkBillModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsBulkBillModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-tight">Bulk Grade Invoicing</h3>
                <button onClick={() => setIsBulkBillModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
             </div>
             <div className="p-10 space-y-6">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Grade</label>
                   <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={bulkBillForm.grade} onChange={e => setBulkBillForm({...bulkBillForm, grade: e.target.value})}>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billing Component</label>
                   <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={bulkBillForm.feeItemId} onChange={e => setBulkBillForm({...bulkBillForm, feeItemId: e.target.value})}>
                      {feeItems.map(f => <option key={f.id} value={f.id}>{f.name} - KES {f.amount}</option>)}
                   </select>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100 flex items-start gap-4">
                   <AlertCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                   <p className="text-xs font-bold text-emerald-800 leading-relaxed">This will generate invoices for all students in <span className="font-black underline">{bulkBillForm.grade}</span>. Balances will be updated instantly.</p>
                </div>
                <button onClick={handleBulkInvoicing} className="w-full bg-emerald-600 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">Generate Bulk Invoices</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL: Student Financial Statement */}
      {selectedStudentLedger && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedStudentLedger(null)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Statement of Account</h3>
                   <p className="text-xs font-bold text-slate-500">{selectedStudentLedger.name} • ADM {selectedStudentLedger.admNo}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => window.print()} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600"><Printer className="w-5 h-5" /></button>
                   <button onClick={() => setSelectedStudentLedger(null)} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-400"><X className="w-5 h-5" /></button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-slate-50 p-6 rounded-[24px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                      <p className="text-3xl font-black text-red-600">KES {selectedStudentLedger.feeBalance.toLocaleString()}</p>
                   </div>
                   <div className="bg-emerald-50 p-6 rounded-[24px]">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Paid (To Date)</p>
                      <p className="text-3xl font-black text-emerald-700">KES {payments.filter(p => p.studentId === selectedStudentLedger.id).reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase text-slate-900 tracking-widest">Transaction History</h4>
                   <div className="border border-slate-100 rounded-3xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                         <thead className="bg-slate-50 font-black text-slate-400 uppercase tracking-tighter">
                            <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Description</th><th className="px-6 py-4 text-right">Debit</th><th className="px-6 py-4 text-right">Credit</th></tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {/* Opening Balance Row */}
                            <tr className="font-bold">
                               <td className="px-6 py-4 text-slate-400">01/01/2024</td>
                               <td className="px-6 py-4">Opening Balance / Prev Term</td>
                               <td className="px-6 py-4 text-right">KES {selectedStudentLedger.feeBalance.toLocaleString()}</td>
                               <td className="px-6 py-4 text-right">-</td>
                            </tr>
                            {/* Actual Payments */}
                            {payments.filter(p => p.studentId === selectedStudentLedger.id).map(p => (
                               <tr key={p.id} className="text-slate-600 font-medium">
                                  <td className="px-6 py-4">{p.date}</td>
                                  <td className="px-6 py-4">Payment: {p.method} ({p.reference})</td>
                                  <td className="px-6 py-4 text-right">-</td>
                                  <td className="px-6 py-4 text-right text-emerald-600 font-black">KES {p.amount.toLocaleString()}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
             
             <div className="p-8 border-t border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Official Financial Document • ElimuSmart Finance</p>
             </div>
          </div>
        </div>
      )}

      {/* REMAINDER OF MODALS (Receipt Print View) remains the same as before ... */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setSelectedReceipt(null)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95">
             <div className="p-10 space-y-8">
                <div className="text-center">
                   <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4">E</div>
                   <h2 className="text-xl font-black uppercase tracking-tight">Greenhill Academy</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Payment Receipt</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] space-y-4 border border-slate-100">
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Receipt No.</span><span className="text-sm font-black text-slate-900">{selectedReceipt.receiptNo}</span></div>
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Learner</span><span className="text-sm font-bold text-slate-700">{students.find(s => s.id === selectedReceipt.studentId)?.name}</span></div>
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Method</span><span className="text-sm font-bold text-slate-700">{selectedReceipt.method}</span></div>
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Ref ID</span><span className="text-xs font-black text-slate-500">{selectedReceipt.reference}</span></div>
                   <div className="pt-2 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Amount Cleared</p>
                      <p className="text-3xl font-black text-emerald-600">KES {selectedReceipt.amount.toLocaleString()}</p>
                   </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                   <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print Receipt</button>
                   <button onClick={() => setSelectedReceipt(null)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm">Close / Dismiss</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
