
import React, { useState } from 'react';
import { 
  Plus, Search, Download, Printer, Send, CheckCircle2, AlertCircle,
  Clock, Banknote, FileText, X, ChevronRight, Hash, CreditCard, Receipt,
  Eye, Trash2, Filter, Wallet, Building, Smartphone, Edit3, Settings
} from 'lucide-react';
import { MOCK_STUDENTS, GRADES, YEARS } from '../constants';
import { Invoice, Student, Payment } from '../types';

interface FeeStructureItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

const FinanceModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'payments' | 'structure'>('invoices');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  
  // Fee Structure State
  const [feeItems, setFeeItems] = useState<FeeStructureItem[]>([
    { id: '1', name: 'Tuition Fee (PP1-PP2)', amount: 8500, category: 'Tuition' },
    { id: '2', name: 'Tuition Fee (Grade 1-6)', amount: 12000, category: 'Tuition' },
    { id: '3', name: 'Tuition Fee (JSS)', amount: 15500, category: 'Tuition' },
    { id: '4', name: 'Lunch Program', amount: 4500, category: 'Auxiliary' },
    { id: '5', name: 'School Transport (Zone A)', amount: 6000, category: 'Transport' },
    { id: '6', name: 'Activity Fee', amount: 1500, category: 'Other' },
  ]);
  const [isAddingFeeItem, setIsAddingFeeItem] = useState(false);
  const [newFeeItem, setNewFeeItem] = useState({ name: '', amount: '', category: 'Tuition' });

  // Finance State
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv1',
      invoiceNo: 'SCH/2024/001',
      studentId: '1',
      studentName: 'Kevin Otieno',
      admNo: '1023',
      grade: 'Grade 6',
      term: 'Term 1',
      year: 2024,
      items: [
        { description: 'Tuition Fee', amount: 12000 },
        { description: 'Lunch Program', amount: 4500 },
        { description: 'Exam Materials', amount: 1500 },
      ],
      totalAmount: 18000,
      paidAmount: 5500,
      dueDate: '2024-02-15',
      status: 'Partial'
    }
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

  const filteredInvoices = invoices.filter(inv => 
    inv.studentName.toLowerCase().includes(invoiceSearch.toLowerCase()) || 
    inv.invoiceNo.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
    inv.admNo.includes(invoiceSearch)
  );

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(paymentForm.amount);
    if (!amountNum || !paymentForm.invoiceId) return;

    // 1. Update Invoice
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === paymentForm.invoiceId) {
        const newPaid = inv.paidAmount + amountNum;
        return {
          ...inv,
          paidAmount: newPaid,
          status: newPaid >= inv.totalAmount ? 'Paid' : 'Partial'
        } as Invoice;
      }
      return inv;
    });
    setInvoices(updatedInvoices);

    // 2. Add Payment Record
    const newPayment: Payment = {
      id: Date.now().toString(),
      receiptNo: `REC/${Math.floor(Math.random() * 9000) + 1000}`,
      invoiceId: paymentForm.invoiceId,
      studentId: paymentForm.studentId,
      amount: amountNum,
      method: paymentForm.method,
      reference: paymentForm.reference || 'N/A',
      date: new Date().toLocaleDateString()
    };
    setPayments([newPayment, ...payments]);

    // 3. Reset and Show Success
    setIsPaymentModalOpen(false);
    setSelectedReceipt(newPayment); // Auto-open receipt
    setPaymentForm({ studentId: '', invoiceId: '', amount: '', method: 'M-Pesa', reference: '' });
  };

  const handleSendSMS = (inv: Invoice) => {
    alert(`Fee Reminder SMS triggered for ${inv.studentName} (Parent: ${MOCK_STUDENTS.find(s => s.id === inv.studentId)?.parentPhone})`);
  };

  const handleAddFeeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeItem.name || !newFeeItem.amount) return;
    const item: FeeStructureItem = {
      id: Date.now().toString(),
      name: newFeeItem.name,
      amount: Number(newFeeItem.amount),
      category: newFeeItem.category
    };
    setFeeItems([...feeItems, item]);
    setIsAddingFeeItem(false);
    setNewFeeItem({ name: '', amount: '', category: 'Tuition' });
  };

  const removeFeeItem = (id: string) => {
    setFeeItems(feeItems.filter(f => f.id !== id));
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified logic for this turn
    setIsInvoiceModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Financial Operations</h2>
          <p className="text-sm text-slate-500 font-medium">Bursar Portal • Academic Year 2024</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button 
             onClick={() => setIsInvoiceModalOpen(true)}
             className="flex-1 sm:flex-none justify-center bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
           >
            <Plus className="w-4 h-4" /> New Invoice
          </button>
           <button 
             onClick={() => setIsPaymentModalOpen(true)}
             className="flex-1 sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl shadow-emerald-100 transition-all active:scale-95"
           >
            <Banknote className="w-5 h-5" /> Record Payment
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'invoices', label: 'Invoices', icon: Receipt },
          { id: 'payments', label: 'Payment History', icon: Clock },
          { id: 'structure', label: 'Fee Structure', icon: Wallet }
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
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-3">
             <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter by Student or Invoice #..." 
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" 
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr><th className="px-8 py-5">Ref</th><th className="px-8 py-5">Student</th><th className="px-8 py-5">Amount</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 group transition-all">
                    <td className="px-8 py-5 text-xs font-black text-slate-900">{inv.invoiceNo}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-900">{inv.studentName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ADM: {inv.admNo}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-slate-900">KES {inv.totalAmount.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-emerald-600">Paid: {inv.paidAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-1">
                          <button onClick={() => setSelectedInvoice(inv)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleSendSMS(inv)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Send className="w-4 h-4" /></button>
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400 font-bold uppercase text-xs">No matching invoices found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'payments' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <tr><th className="px-8 py-5">Receipt #</th><th className="px-8 py-5">Student</th><th className="px-8 py-5">Amount</th><th className="px-8 py-5">Method</th><th className="px-8 py-5 text-right">Action</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {payments.length === 0 ? (
                   <tr><td colSpan={5} className="p-12 text-center text-slate-400 font-bold uppercase text-xs">No payments recorded yet</td></tr>
                 ) : (
                   payments.map(pay => (
                     <tr key={pay.id} className="hover:bg-slate-50/50 transition-all group">
                       <td className="px-8 py-5 text-xs font-black text-slate-900">{pay.receiptNo}</td>
                       <td className="px-8 py-5 text-sm font-bold text-slate-700">{MOCK_STUDENTS.find(s => s.id === pay.studentId)?.name}</td>
                       <td className="px-8 py-5 text-sm font-black text-emerald-600">KES {pay.amount.toLocaleString()}</td>
                       <td className="px-8 py-5"><span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded-lg">{pay.method}</span></td>
                       <td className="px-8 py-5 text-right"><button onClick={() => setSelectedReceipt(pay)} className="p-2 text-slate-400 hover:text-emerald-600"><Printer className="w-4 h-4" /></button></td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeSubTab === 'structure' && (
        <div className="space-y-6 animate-in fade-in">
           <div className="flex justify-between items-center bg-emerald-50 p-6 rounded-[24px] border border-emerald-100">
              <div>
                 <h4 className="text-emerald-900 font-black uppercase tracking-tight text-sm">Fee Management Console</h4>
                 <p className="text-emerald-700 text-[10px] font-bold">Define tuition and auxiliary costs for various categories.</p>
              </div>
              <button 
                onClick={() => setIsAddingFeeItem(true)}
                className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feeItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                         <Receipt className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-slate-300 hover:text-emerald-600"><Edit3 className="w-3.5 h-3.5" /></button>
                         <button onClick={() => removeFeeItem(item.id)} className="p-2 text-slate-300 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                   </div>
                   <h5 className="font-black text-slate-900 text-sm mb-1">{item.name}</h5>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{item.category}</p>
                   <p className="text-2xl font-black text-emerald-600">KES {item.amount.toLocaleString()}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPaymentModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <Banknote className="w-7 h-7" />
                 <h3 className="text-xl font-bold uppercase tracking-tight">Financial Receipting</h3>
               </div>
               <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-10 space-y-6">
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">1. Select Student & Invoice</label>
                 <select 
                   required
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                   value={paymentForm.invoiceId}
                   onChange={e => {
                     const inv = invoices.find(i => i.id === e.target.value);
                     setPaymentForm({...paymentForm, invoiceId: e.target.value, studentId: inv?.studentId || ''});
                   }}
                 >
                   <option value="">Search Outstanding Invoices...</option>
                   {invoices.filter(i => i.status !== 'Paid').map(inv => (
                     <option key={inv.id} value={inv.id}>{inv.studentName} - {inv.invoiceNo} (Bal: {(inv.totalAmount - inv.paidAmount).toLocaleString()})</option>
                   ))}
                 </select>
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">2. Payment Method</label>
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
                        className={`flex-1 p-4 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-2 transition-all ${paymentForm.method === m.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        <m.icon className="w-5 h-5" /> {m.id}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">3. Amount (KES)</label>
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
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">4. {paymentForm.method} Ref #</label>
                   <input 
                     type="text" 
                     required={paymentForm.method !== 'Cash'}
                     placeholder={paymentForm.method === 'M-Pesa' ? 'e.g. RBS78...' : 'Ref ID'}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                     value={paymentForm.reference}
                     onChange={e => setPaymentForm({...paymentForm, reference: e.target.value})}
                   />
                 </div>
               </div>

               <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">Complete Transaction</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Fee Item Modal */}
      {isAddingFeeItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={() => setIsAddingFeeItem(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
             <div className="p-10 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <Settings className="w-6 h-6 text-emerald-600" />
                   <h3 className="text-xl font-black uppercase tracking-tight">Add Fee Structure Item</h3>
                </div>
                <form onSubmit={handleAddFeeItem} className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Name / Description</label>
                      <input required type="text" placeholder="e.g. Tuition Grade 4" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newFeeItem.name} onChange={e => setNewFeeItem({...newFeeItem, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none" value={newFeeItem.category} onChange={e => setNewFeeItem({...newFeeItem, category: e.target.value})}>
                           <option>Tuition</option>
                           <option>Transport</option>
                           <option>Auxiliary</option>
                           <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount (KES)</label>
                        <input required type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-black text-emerald-700" value={newFeeItem.amount} onChange={e => setNewFeeItem({...newFeeItem, amount: e.target.value})} />
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button type="button" onClick={() => setIsAddingFeeItem(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Discard</button>
                      <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">Save Item</button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedReceipt(null)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 print-area">
             <div className="p-10 space-y-8">
                <div className="text-center">
                   <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4">E</div>
                   <h2 className="text-xl font-black uppercase tracking-tight">Greenhill Academy</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Payment Receipt</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] space-y-4 border border-slate-100">
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Receipt No.</span><span className="text-sm font-black text-slate-900">{selectedReceipt.receiptNo}</span></div>
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Learner</span><span className="text-sm font-bold text-slate-700">{MOCK_STUDENTS.find(s => s.id === selectedReceipt.studentId)?.name}</span></div>
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Method</span><span className="text-sm font-bold text-slate-700">{selectedReceipt.method}</span></div>
                   <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase">Ref ID</span><span className="text-xs font-black text-slate-500">{selectedReceipt.reference}</span></div>
                   <div className="pt-2 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Amount Cleared</p>
                      <p className="text-3xl font-black text-emerald-600">KES {selectedReceipt.amount.toLocaleString()}</p>
                   </div>
                </div>

                <div className="pt-4 flex flex-col gap-2 no-print">
                   <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print Receipt</button>
                   <button onClick={() => setSelectedReceipt(null)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm">Close / Dismiss</button>
                </div>
                
                <div className="text-center pt-2">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Digitally Certified by ElimuSmart</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
