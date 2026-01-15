
import React, { useState, useMemo } from 'react';
import { FileText, Download, Printer, Filter, Search, X, CheckCircle, GraduationCap, Eye, Loader2, Award } from 'lucide-react';
import { GRADES, INITIAL_SUBJECTS } from '../constants';
import { Student } from '../types';

interface ReportsModuleProps {
  students: Student[];
  marks: Record<string, Record<string, { score: string; remark: string }>>;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ students, marks }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);

  const calculateCompetency = (score: number) => {
    if (score >= 80) return 'EE';
    if (score >= 50) return 'ME';
    if (score >= 30) return 'AE';
    return 'BE';
  };

  const getCompetencyFull = (score: number) => {
    if (score >= 80) return 'Exceeding Expectations';
    if (score >= 50) return 'Meeting Expectations';
    if (score >= 30) return 'Approaching Expectations';
    return 'Below Expectations';
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.admNo.includes(searchTerm);
    const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const getStudentStats = (studentId: string) => {
    const studentMarks = marks[studentId] || {};
    const scores = Object.values(studentMarks)
      // FIX: Explicitly type the map parameter 'm' to resolve 'unknown' type error in some environments
      .map((m: any) => Number(m.score))
      .filter(s => !isNaN(s) && s > 0);
    
    if (scores.length === 0) return { mean: 0, grade: 'P' };
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    let grade = 'E';
    if (mean >= 80) grade = 'A';
    else if (mean >= 70) grade = 'B';
    else if (mean >= 60) grade = 'C';
    else if (mean >= 50) grade = 'D';
    
    return { mean: mean.toFixed(1), grade };
  };

  const openPreview = (student: Student) => {
    setSelectedStudent(student);
    setIsPreviewOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBulkExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Bulk Report Generation Complete. Download started.');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Academic Reports</h2>
          <p className="text-sm text-slate-500 font-medium">Generate termly report cards and class merit lists.</p>
        </div>
        <div className="w-full sm:w-auto flex gap-2">
           <button 
            disabled={isExporting}
            onClick={handleBulkExport}
            className="flex-1 sm:flex-none bg-slate-800 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-slate-900 transition-all disabled:opacity-50"
           >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Bulk Export (PDF)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student by Name or Admission..." 
              className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-2xl text-sm font-black focus:ring-2 focus:ring-emerald-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-slate-700 outline-none appearance-none cursor-pointer hover:bg-slate-100"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
               <option value="All">All Grades</option>
               {GRADES.map(grade => (
                 <option key={grade} value={grade}>{grade}</option>
               ))}
            </select>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? filteredStudents.map((student) => {
          const stats = getStudentStats(student.id);
          const hasMarks = stats.mean !== 0;

          return (
            <div key={student.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 flex-shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{student.name}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">ADM: {student.admNo}</p>
                    </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${hasMarks ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                   {hasMarks ? 'Finalized' : 'Draft'}
                 </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mean Score</p>
                  <p className="text-lg font-black text-emerald-600">{stats.mean}%</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mean Grade</p>
                  <p className="text-lg font-black text-slate-800">{stats.grade}</p>
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-slate-50 grid grid-cols-3 gap-2">
                 <button 
                  onClick={() => openPreview(student)}
                  className="col-span-2 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                 >
                    <Eye className="w-4 h-4" /> View Report
                 </button>
                 <button onClick={handlePrint} title="Print Quick" className="flex items-center justify-center p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all">
                    <Printer className="w-4 h-4" />
                 </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full p-20 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No reports found for this filter</p>
          </div>
        )}
      </div>

      {/* Report Card Preview Modal */}
      {isPreviewOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPreviewOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                    <GraduationCap className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">Academic Report Card</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Term 1 • 2024 Academic Year</p>
                 </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={handlePrint} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><Printer className="w-5 h-5" /></button>
                  <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><Download className="w-5 h-5" /></button>
                  <button onClick={() => setIsPreviewOpen(false)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><X className="w-5 h-5" /></button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 print-area scrollbar-hide">
               {/* Document Header */}
               <div className="text-center space-y-2">
                 <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <span className="text-emerald-600 font-black text-3xl">E</span>
                 </div>
                 <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Greenhill Academy</h1>
                 <p className="text-sm font-bold text-slate-500">P.O. Box 12345 - 00100, Nairobi, Kenya | info@greenhill.ac.ke</p>
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Strive for Excellence</p>
                 <div className="w-32 h-[2px] bg-emerald-600 mx-auto mt-6"></div>
               </div>

               {/* Student Meta */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-200/60 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learner Name</span><span className="text-sm font-black text-slate-900">{selectedStudent.name}</span></div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission No.</span><span className="text-sm font-black text-slate-900">{selectedStudent.admNo}</span></div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</span><span className="text-sm font-black text-slate-900">{selectedStudent.gender}</span></div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-200/60 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade Level</span><span className="text-sm font-black text-slate-900">{selectedStudent.grade}</span></div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stream</span><span className="text-sm font-black text-slate-900">{selectedStudent.stream}</span></div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Year</span><span className="text-sm font-black text-slate-900">2024</span></div>
                 </div>
               </div>

               {/* Academic Table */}
               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" /> Assessment Records
                  </h4>
                  <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                       <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-4">Subject Learning Area</th>
                            <th className="px-6 py-4">Score (%)</th>
                            <th className="px-6 py-4">Competency</th>
                            <th className="px-6 py-4">Teacher Remark</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {INITIAL_SUBJECTS.map((subject) => {
                             const data = marks[selectedStudent.id]?.[subject.id] || { score: '', remark: '' };
                             const scoreNum = Number(data.score);
                             const comp = data.score ? calculateCompetency(scoreNum) : 'P';
                             
                             return (
                               <tr key={subject.id} className="text-xs font-bold text-slate-700">
                                  <td className="px-6 py-4">{subject.name}</td>
                                  <td className="px-6 py-4 text-slate-900">{data.score || '-'}</td>
                                  <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-md text-[9px] font-black ${
                                       comp === 'EE' ? 'bg-emerald-100 text-emerald-700' :
                                       comp === 'ME' ? 'bg-blue-100 text-blue-700' :
                                       comp === 'AE' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                                     }`}>
                                       {comp === 'P' ? 'Pending' : comp}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-[10px] text-slate-500 italic">{data.remark || 'N/A'}</td>
                               </tr>
                             );
                          })}
                       </tbody>
                    </table>
                  </div>
               </div>

               {/* Summative Section */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-emerald-600 p-6 rounded-[28px] text-white flex flex-col justify-center items-center">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Overall Mean</p>
                     <p className="text-3xl font-black">{getStudentStats(selectedStudent.id).mean}%</p>
                  </div>
                  <div className="md:col-span-2 bg-slate-50 p-6 rounded-[28px] border border-slate-100 flex flex-col justify-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Class Teacher's General Remarks</p>
                     <p className="text-sm font-bold text-slate-900">
                        {Number(getStudentStats(selectedStudent.id).mean) >= 70 
                          ? 'Outstanding performance. The learner demonstrates mastery of most concepts across learning areas.' 
                          : 'Satisfactory work. More effort is required in core technical learning areas to achieve full competency.'}
                     </p>
                  </div>
               </div>
               
               <div className="text-center pt-10 border-t border-slate-100">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">ElimuSmart Kenya • Digital Academic Transcript • Verified</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
