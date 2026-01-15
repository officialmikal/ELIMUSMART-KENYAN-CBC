
import React, { useState } from 'react';
import { Save, Plus, Trash2, Settings, BookOpen, Layers, Calendar } from 'lucide-react';
import { MOCK_STUDENTS, INITIAL_SUBJECTS, YEARS } from '../constants';
import { Subject, UserRole } from '../types';

interface MarksEntryModuleProps {
  userRole: UserRole;
}

const MarksEntryModule: React.FC<MarksEntryModuleProps> = ({ userRole }) => {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState(INITIAL_SUBJECTS[0].id);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', category: 'CBC' as any });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.name) {
      const sub: Subject = { 
        id: Date.now().toString(), 
        name: newSubject.name, 
        category: newSubject.category 
      };
      setSubjects([...subjects, sub]);
      setNewSubject({ name: '', category: 'CBC' });
      setIsAddingSubject(false);
    }
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      const updated = subjects.filter(s => s.id !== id);
      setSubjects(updated);
      if (selectedSubject === id) setSelectedSubject(updated[0].id);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Academic Assessment</h2>
          <p className="text-sm text-slate-500">Record Competencies for Kenyan CBC (Primary) and JSS</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsAddingSubject(true)}
            className="flex-1 sm:flex-none bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
          <button className="flex-1 sm:flex-none bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 active:scale-95 transition-all">
            <Save className="w-4 h-4" /> Save Marks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <BookOpen className="w-32 h-32" />
        </div>
        
        <div className="relative">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Layers className="w-3 h-3" /> Select Subject
          </label>
          <div className="flex gap-2">
            <select 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.category})</option>)}
            </select>
            {userRole === UserRole.ADMIN && (
               <button onClick={() => removeSubject(selectedSubject)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors" title="Delete this subject">
                 <Trash2 className="w-5 h-5" />
               </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Academic Year
          </label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none appearance-none">
             {YEARS.map(year => (
               <option key={year} value={year}>{year}</option>
             ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Academic Term</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none appearance-none">
             <option>Term 1 (Opening)</option>
             <option>Term 2 (Mid-Year)</option>
             <option>Term 3 (Final)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Student / Learner</th>
                <th className="px-8 py-5">ADM</th>
                <th className="px-8 py-5">Score (%)</th>
                <th className="px-8 py-5">CBC Competency Level</th>
                <th className="px-8 py-5">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-4">
                    <div className="text-sm font-bold text-slate-900">{student.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{student.grade}</div>
                  </td>
                  <td className="px-8 py-4 text-xs font-black text-slate-400">{student.admNo}</td>
                  <td className="px-8 py-4">
                    <input type="number" className="w-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-black text-center text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0" />
                  </td>
                  <td className="px-8 py-4">
                    <select className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Exceeding Expectations (EE)</option>
                      <option>Meeting Expectations (ME)</option>
                      <option>Approaching Expectations (AE)</option>
                      <option>Below Expectations (BE)</option>
                    </select>
                  </td>
                  <td className="px-8 py-4">
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium placeholder:text-slate-300 outline-none" placeholder="Comment on progress..." />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {isAddingSubject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setIsAddingSubject(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-600" /> Define New Subject
            </h3>
            <form onSubmit={handleAddSubject} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g. Creative Writing"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Curriculum Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none appearance-none"
                  value={newSubject.category}
                  onChange={(e) => setNewSubject({...newSubject, category: e.target.value as any})}
                >
                  <option value="CBC">CBC (Primary / Grade 1-6)</option>
                  <option value="JSS">JSS (Junior Sec / Grade 7-9)</option>
                  <option value="8-4-4">8-4-4 (Old System)</option>
                  <option value="Other">Other / Extra-Curricular</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAddingSubject(false)}
                  className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  type="submit"
                  className="py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntryModule;
