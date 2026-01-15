
import React, { useState } from 'react';
import { Save, CheckCircle, Search, Filter } from 'lucide-react';
import { MOCK_STUDENTS, SUBJECTS } from '../constants';

const MarksEntryModule: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedGrade, setSelectedGrade] = useState('Grade 6');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Academic Assessment</h2>
          <p className="text-slate-500">Record marks and CBC competencies for your students.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleSave}
             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
           >
            <Save className="w-5 h-5" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2">Class / Grade</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7 (JSS)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2">Term</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            <option>Term 1 - 2024</option>
            <option>Term 2 - 2024</option>
            <option>Term 3 - 2024</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">ADM NO</th>
              <th className="px-6 py-4">Marks (Out of 100)</th>
              <th className="px-6 py-4">CBC Competency</th>
              <th className="px-6 py-4">Teacher Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_STUDENTS.filter(s => s.grade === selectedGrade).map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.admNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <input 
                     type="number" 
                     className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold"
                     placeholder="0"
                     max="100"
                   />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select className="text-xs bg-slate-50 border border-slate-200 rounded p-1.5 focus:ring-0">
                    <option>Exceeding Expectations (EE)</option>
                    <option>Meeting Expectations (ME)</option>
                    <option>Approaching Expectations (AE)</option>
                    <option>Below Expectations (BE)</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="text" 
                    className="w-full min-w-[200px] bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none"
                    placeholder="E.g. Excellent work, keep it up!"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isSaved && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-10">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Draft saved successfully!</span>
        </div>
      )}
    </div>
  );
};

export default MarksEntryModule;
