
import React from 'react';
import { FileText, Download, Printer, Filter, Search } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';

const ReportsModule: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Academic Reports</h2>
          <p className="text-slate-500">Generate report cards and class performance lists.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors">
            <Download className="w-5 h-5" />
            Bulk Export (PDF)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student for report card..." 
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700">
               <option>Grade 6 - A</option>
               <option>Grade 6 - B</option>
               <option>Grade 7 - Red</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_STUDENTS.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{student.name}</h4>
                    <p className="text-xs text-slate-500">ADM: {student.admNo}</p>
                  </div>
               </div>
               <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                 Ready
               </span>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Average Score</span>
                <span className="font-bold text-slate-800">74.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Rank</span>
                <span className="font-bold text-slate-800">12 of 45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Overall Grade</span>
                <span className="font-bold text-emerald-600">B+</span>
              </div>
            </div>

            <div className="mt-auto flex gap-2 pt-4 border-t border-slate-50">
               <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                  <FileText className="w-4 h-4" /> View Card
               </button>
               <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-lg">
                  <Printer className="w-4 h-4" />
               </button>
               <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-lg">
                  <Download className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsModule;
