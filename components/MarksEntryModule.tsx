
import React, { useState } from 'react';
import { Save, Plus, Trash2, BookOpen, Layers, Calendar, CheckCircle } from 'lucide-react';
import { INITIAL_SUBJECTS, YEARS } from '../constants';
import { Subject, UserRole, Student } from '../types';

interface MarksEntryModuleProps {
  userRole: UserRole;
  students: Student[];
  marks: Record<string, Record<string, { score: string; remark: string }>>;
  setMarks: React.Dispatch<React.SetStateAction<Record<string, Record<string, { score: string; remark: string }>>>>;
}

const MarksEntryModule: React.FC<MarksEntryModuleProps> = ({ userRole, students, marks, setMarks }) => {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState(INITIAL_SUBJECTS[0].id);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', category: 'CBC' as any });
  const [isSaving, setIsSaving] = useState(false);

  const calculateCompetency = (score: number) => {
    if (score >= 80) return 'EE (Exceeding Expectations)';
    if (score >= 50) return 'ME (Meeting Expectations)';
    if (score >= 30) return 'AE (Approaching Expectations)';
    return 'BE (Below Expectations)';
  };

  const handleMarkChange = (studentId: string, score: string) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [selectedSubject]: {
          ...(prev[studentId]?.[selectedSubject] || { remark: '' }),
          score
        }
      }
    }));
    
    // Automatic Save Trigger (Simulation)
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [selectedSubject]: {
          ...(prev[studentId]?.[selectedSubject] || { score: '' }),
          remark
        }
      }
    }));
  };

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
          <p className="text-sm text-slate-500 font-medium">Auto-calculating CBC and JSS Competency Scores</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isSaving ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isSaving ? 'Syncing...' : <><CheckCircle className="w-4 h-4" /> Live Saving</>}
          </div>
          <button 
            onClick={() => setIsAddingSubject(true)}
            className="flex-1 sm:flex-none bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> New Subject
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-emerald-600">
          <BookOpen className="w-32 h-32" />
        </div>
        
        <div className="relative">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Layers className="w-3 h-3" /> Quick Select Subject
          </label>
          <div className="flex gap-2">
            <select 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
            <Calendar className="w-3 h-3" /> Academic Cycle
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
                <th className="px-8 py-5">Learner Identity</th>
                <th className="px-8 py-5">ADM</th>
                <th className="px-8 py-5">Score (%)</th>
                <th className="px-8 py-5">Auto-Competency Level</th>
                <th className="px-8 py-5">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const currentData = marks[student.id]?.[selectedSubject] || { score: '', remark: '' };
                const currentScore = currentData.score;
                const competency = currentScore ? calculateCompetency(Number(currentScore)) : 'Pending Input';
                
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-4">
                      <div className="text-sm font-bold text-slate-900">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{student.grade}</div>
                    </td>
                    <td className="px-8 py-4 text-xs font-black text-slate-400">{student.admNo}</td>
                    <td className="px-8 py-4">
                      <input 
                        type="number" 
                        min="0" 
                        max="100"
                        className="w-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-black text-center text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        placeholder="0"
                        value={currentScore}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                      />
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-lg border ${
                        competency.includes('EE') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        competency.includes('ME') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        competency.includes('AE') ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        competency.includes('BE') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {competency}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium placeholder:text-slate-300 outline-none" 
                        placeholder="Write dynamic remark..." 
                        value={currentData.remark}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal remains same ... */}
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
