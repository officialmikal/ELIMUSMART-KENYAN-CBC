
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Printer, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Banknote,
  FileText
} from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { Invoice } from '../types';

const FinanceModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'payments' | 'structure'>('invoices');
  
  const mockInvoices: Invoice[] = [
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
    },
    {
      id: 'inv2',
      invoiceNo: 'SCH/2024/002',
      studentId: '2',
      studentName: 'Sarah Mwangi',
      admNo: '1045',
      grade: 'Grade 5',
      term: 'Term 1',
      year: 2024,
      items: [
        { description: 'Tuition Fee', amount: 12000 },
        { description: 'Lunch Program', amount: 4500 },
      ],
      totalAmount: 16500,
      paidAmount: 16500,
      dueDate: '2024-02-15',
      status: 'Paid'
    }
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Finance & Invoicing</h2>
          <p className="text-slate-500">Manage school fees, generate invoices, and track payments.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors">
            <Plus className="w-5 h-5" />
            Generate Invoice
          </button>
           <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors">
            <Banknote className="w-5 h-5" />
            Record Payment
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveSubTab('invoices')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeSubTab === 'invoices' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Invoices
          {activeSubTab === 'invoices' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></div>}
        </button>
        <button 
          onClick={() => setActiveSubTab('payments')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeSubTab === 'payments' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Recent Payments
          {activeSubTab === 'payments' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></div>}
        </button>
        <button 
          onClick={() => setActiveSubTab('structure')}
          className={`pb-3 text-sm font-bold transition-colors relative ${activeSubTab === 'structure' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Fee Structure
          {activeSubTab === 'structure' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></div>}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Student or Invoice ID..." 
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <FileText className="w-4 h-4 text-slate-400" />
                       <span className="text-sm font-bold text-slate-900">{inv.invoiceNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{inv.studentName}</div>
                    <div className="text-xs text-slate-500">ADM: {inv.admNo} | {inv.grade}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">KES {inv.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-emerald-600">Paid: KES {inv.paidAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                      inv.status === 'Partial' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {inv.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : 
                       inv.status === 'Partial' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button title="Print" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button title="Download PDF" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                      <button title="Send to Parent" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;
