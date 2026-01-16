
import React, { useState, useMemo } from 'react';
import { FileText, Download, Printer, Filter, Search, X, CheckCircle, GraduationCap, Eye, Loader2, Award, TrendingUp, Trophy, ShieldCheck, CalendarDays } from 'lucide-react';
import { GRADES, INITIAL_SUBJECTS } from '../constants';
import { Student } from '../types';
import Papa from 'papaparse';

interface ReportsModuleProps {
  students: Student[];
  marks: Record<string, Record<string, { score: string; remark: string }>>;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ students, marks }) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'merit'>('individual');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  const getStudentStats = (studentId: string) => {
    const studentMarks = marks[studentId] || {};
    const scores = Object.values(studentMarks)
      .map((m: any) => Number(m.score))
      .filter(s => !isNaN(s) && s > 0);
    if (scores.length === 0) return { mean: 0, grade: 'P' };
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    let grade = 'E';
    if (mean >= 80) grade = 'A'; else if (mean >= 70) grade = 'B'; else if (mean >= 60) grade = 'C'; else if (mean >= 50) grade = 'D';
    return { mean: Number(mean.toFixed(1)), grade };
  };

  const meritList = useMemo(() => {
    const list = students.map(s => ({ ...s, stats: getStudentStats(s.id) }));
    return list.sort((a, b) => b.stats.mean - a.stats.mean);
  }, [students, marks]);

  const filteredMerit = meritList.filter(s => {
    const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleExportMerit = () => {
    const data = filteredMerit.map((s, idx) => ({ 'Rank': idx + 1, 'ADM': s.admNo, 'Name': s.name, 'Grade': s.grade, 'Mean %': s.stats.mean }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `Merit_List_${gradeFilter}_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const handleDownloadReport = (student: Student) => {
    const studentMarks = marks[student.id] || {};
    const data = INITIAL_SUBJECTS.map(sub => ({
      'Learning Area': sub.name,
      'Curriculum': sub.category,
      'Score (%)': studentMarks[sub.id]?.score || '-',
      'Teacher Remarks': studentMarks[sub.id]?.remark || '-'
    }));

    const csv = Papa.unparse({
      fields: ['Learning Area', 'Curriculum', 'Score (%)', 'Teacher Remarks'],
      data: data
    });

    const header = `OFFICIAL REPORT CARD\nStudent: ${student.name}\nADM: ${student.admNo}\nGrade: ${student.grade}\nMean Score: ${getStudentStats(student.id).mean}%\n\n`;
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `Report_Card_${student.admNo}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Academic Analytics</h2>
          <p className="text-sm text-slate-500 font-medium italic">Termly merit lists and learner report cards</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveTab('individual')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Individual Cards</button>
           <button onClick={() => setActiveTab('merit')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'merit' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Class Merit List</button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Filter by Name or Admission..." className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-xs font-black focus:ring-2 focus:ring-emerald-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-[10px] font-black text-slate-700 outline-none uppercase" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
               <option value="All">All Grades</option>
               {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {activeTab === 'merit' && <button onClick={handleExportMerit} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-colors" title="Download Excel Merit List"><Download className="w-5 h-5" /></button>}
          </div>
      </div>

      {activeTab === 'individual' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMerit.map((s) => (
            <div key={s.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-emerald-200 group transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">{s.name.charAt(0)}</div>
                    <div><h4 className="font-bold text-slate-900 text-sm">{s.name}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ADM: {s.admNo}</p></div>
                 </div>
                 <button onClick={() => handleDownloadReport(s)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Download Results"><Download className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-[24px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Mean Score</p>
                  <p className="text-xl font-black text-emerald-600">{s.stats.mean}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-[24px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Grade</p>
                  <p className="text-xl font-black text-slate-800">{s.stats.grade}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedStudent(s); setIsPreviewOpen(true); }} className="w-full py-4 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-black flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> View Report Card</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr><th className="px-10 py-6">Rank</th><th className="px-10 py-6">Learner Profile</th><th className="px-10 py-6 text-center">Subjects Entered</th><th className="px-10 py-6 text-right">Mean Average</th><th className="px-10 py-6 text-right">Grade</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMerit.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-6"><div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${idx < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</div></td>
                    <td className="px-10 py-6"><div><p className="text-sm font-black text-slate-900">{s.name}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ADM: {s.admNo} • {s.grade}</p></div></td>
                    <td className="px-10 py-6 text-center text-xs font-bold text-slate-500">{Object.keys(marks[s.id] || {}).length} Learning Areas</td>
                    <td className="px-10 py-6 text-right font-black text-emerald-600 text-sm">{s.stats.mean}%</td>
                    <td className="px-10 py-6 text-right"><span className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-black">{s.stats.grade}</span></td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {isPreviewOpen && selectedStudent && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsPreviewOpen(false)} />
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 scrollbar-hide p-10 md:p-16">
              
              {/* Report Header */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
                 <div className="flex items-center gap-6">
                   <div className="w-24 h-24 bg-emerald-600 text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-xl shadow-emerald-100">E</div>
                   <div>
                     <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none mb-2">Greenhill Academy</h3>
                     <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Official Academic Transcript
                     </div>
                   </div>
                 </div>
                 <div className="text-left md:text-right space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center md:justify-end gap-2"><CalendarDays className="w-3 h-3" /> Cycle: 2024 - Term 1</p>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Status: {getStudentStats(selectedStudent.id).mean > 0 ? 'Verified & Finalized' : 'Draft / Interim'}</p>
                 </div>
              </div>

              {/* Student Bio Strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50 p-8 rounded-[40px] mb-12 border border-slate-100">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Learner Particulars</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900 tracking-tight">{selectedStudent.name}</p>
                      <p className="text-sm font-bold text-slate-500">Admission No: <span className="text-slate-900">{selectedStudent.admNo}</span></p>
                      <p className="text-sm font-bold text-slate-500">Grade & Stream: <span className="text-emerald-700">{selectedStudent.grade} {selectedStudent.stream}</span></p>
                    </div>
                 </div>
                 <div className="text-left md:text-right space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Institutional Ranking</p>
                    <div className="space-y-1">
                      <p className="text-5xl font-black text-emerald-600 leading-none">{getStudentStats(selectedStudent.id).mean}%</p>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-widest mt-2">Aggregate Grade: <span className="bg-slate-900 text-white px-2 py-0.5 rounded ml-1">{getStudentStats(selectedStudent.id).grade}</span></p>
                    </div>
                 </div>
              </div>

              {/* Learning Areas Breakdown */}
              <div className="space-y-6 mb-16">
                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Learning Area Competency Assessment
                 </h4>
                 <div className="divide-y divide-slate-100 border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                    <div className="grid grid-cols-4 bg-slate-100/50 p-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <span className="col-span-1">Learning Area</span>
                       <span className="text-center">Category</span>
                       <span className="text-center">Score (%)</span>
                       <span className="text-right">Performance Level</span>
                    </div>
                    {INITIAL_SUBJECTS.map(sub => {
                       const data = marks[selectedStudent.id]?.[sub.id];
                       return (
                          <div key={sub.id} className="grid grid-cols-4 p-5 hover:bg-slate-50/50 transition-colors">
                             <span className="text-xs font-black text-slate-700">{sub.name}</span>
                             <span className="text-center text-[10px] font-bold text-slate-400 uppercase">{sub.category}</span>
                             <span className="text-center text-xs font-black text-slate-900">{data?.score || '-'}</span>
                             <span className="text-right">
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                                  data?.score ? (Number(data.score) >= 80 ? 'bg-emerald-100 text-emerald-700' : Number(data.score) >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700') : 'text-slate-300'
                                }`}>
                                  {data?.score ? (Number(data.score) >= 80 ? 'Exceeding' : Number(data.score) >= 50 ? 'Meeting' : 'Approaching') : 'Pending'}
                                </span>
                             </span>
                          </div>
                       )
                    })}
                 </div>
              </div>

              {/* Signatures and Institutional Seal - Only show if assessment is complete */}
              {getStudentStats(selectedStudent.id).mean > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-slate-100 pt-12 relative">
                   {/* Institutional Seal Placeholder */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                      <div className="w-48 h-48 border-[12px] border-emerald-950 rounded-full flex items-center justify-center">
                         <ShieldCheck className="w-24 h-24 text-emerald-950" />
                      </div>
                   </div>

                   {/* Class Teacher Section */}
                   <div className="space-y-10 relative z-10">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Class Teacher Remarks</p>
                        <div className="h-12 border-b-2 border-slate-100 text-sm font-medium italic text-slate-600">
                           {marks[selectedStudent.id]?.[INITIAL_SUBJECTS[0].id]?.remark || "Learner is showing steady progress in all evaluated areas."}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-4">
                         <div className="w-full border-b border-slate-900 h-10"></div>
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">Class Teacher's Signature</p>
                      </div>
                   </div>

                   {/* Head Teacher Section */}
                   <div className="space-y-10 relative z-10">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Head Teacher / Principal's Remarks</p>
                        <div className="h-12 border-b-2 border-slate-100 text-sm font-medium italic text-slate-600">
                           Approved for cycle closure. Commendable effort in standard assessments.
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-4">
                         <div className="w-full border-b border-slate-900 h-10"></div>
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">Head Teacher's Signature & Stamp</p>
                      </div>
                   </div>
                </div>
              )}

              {/* Print/Download Actions */}
              <div className="flex gap-4 mt-16 print:hidden">
                 <button onClick={() => handleDownloadReport(selectedStudent)} className="flex-1 py-5 bg-slate-100 text-slate-900 rounded-[28px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                   <Download className="w-5 h-5" /> Download Spreadsheet
                 </button>
                 <button onClick={() => window.print()} className="flex-1 py-5 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-all">
                   <Printer className="w-5 h-5" /> Authorized Print Handshake
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
