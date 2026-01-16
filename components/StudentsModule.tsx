
import React, { useState, useRef } from 'react';
import { Search, Plus, Trash2, Eye, X, UserPlus, ShieldAlert, Banknote, ShieldCheck, AlertCircle, FileUp, Loader2, Download } from 'lucide-react';
import { GRADES } from '../constants';
import { Student, UserRole } from '../types';
import Papa from 'papaparse';

interface StudentsModuleProps {
  userRole: UserRole;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  privacyMode?: boolean;
}

const StudentsModule: React.FC<StudentsModuleProps> = ({ userRole, students, setStudents, privacyMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; student: Student | null }>({
    isOpen: false,
    student: null
  });
  const [confirmAdm, setConfirmAdm] = useState('');

  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    admNo: '',
    gender: 'Male',
    dob: '2015-01-01',
    grade: 'PP1',
    stream: 'A',
    parentName: '',
    parentPhone: '',
    residence: '',
    feeBalance: 0
  });

  const maskPhone = (phone: string) => {
    if (!privacyMode) return phone;
    return phone.substring(0, 6) + "****" + phone.substring(phone.length - 2);
  };

  const maskBalance = (balance: number) => {
    if (!privacyMode) return `KES ${balance.toLocaleString()}`;
    return 'KES ••••••';
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.admNo.includes(searchTerm) ||
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (student: Student) => {
    setDeleteModal({ isOpen: true, student: student });
    setConfirmAdm('');
  };

  const handleDelete = () => {
    if (deleteModal.student && confirmAdm === deleteModal.student.admNo) {
      setStudents(prev => prev.filter(s => s.id !== deleteModal.student?.id));
      setDeleteModal({ isOpen: false, student: null });
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedData = results.data as any[];
        setStudents(prev => {
          const updatedList = [...prev];
          importedData.forEach(row => {
            const studentIdx = updatedList.findIndex(s => s.admNo === row.ADM);
            const newStudentObj: Student = {
              id: studentIdx >= 0 ? updatedList[studentIdx].id : Date.now().toString() + Math.random(),
              name: row.Name || row.name || 'Unknown',
              admNo: row.ADM || row.admNo || 'N/A',
              gender: (row.Gender || row.gender || 'Male') as any,
              dob: row.DOB || row.dob || '2015-01-01',
              grade: row.Grade || row.grade || 'PP1',
              stream: row.Stream || row.stream || 'A',
              parentName: row.Parent || row.parentName || 'N/A',
              parentPhone: row.Phone || row.parentPhone || 'N/A',
              residence: row.Residence || row.residence || 'N/A',
              feeBalance: Number(row.Balance || row.feeBalance || 0)
            };

            if (studentIdx >= 0) {
              updatedList[studentIdx] = newStudentObj;
            } else {
              updatedList.unshift(newStudentObj);
            }
          });
          return updatedList;
        });
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (err) => {
        console.error('CSV Parsing Error:', err);
        setIsUploading(false);
      }
    });
  };

  const handleExportExcel = () => {
    const dataToExport = students.map(s => ({
      'ADM': s.admNo,
      'Name': s.name,
      'Gender': s.gender,
      'Grade': s.grade,
      'Stream': s.stream,
      'DOB': s.dob,
      'Parent': s.parentName,
      'Phone': s.parentPhone,
      'Residence': s.residence,
      'Balance': s.feeBalance
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Students_Master_List_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    const studentToAdd = {
      ...newStudent,
      id: Date.now().toString(),
      feeBalance: Number(newStudent.feeBalance) || 0
    } as Student;
    setStudents(prev => [studentToAdd, ...prev]);
    setIsEnrollModalOpen(false);
    setNewStudent({
      name: '', admNo: '', gender: 'Male', dob: '2015-01-01',
      grade: 'PP1', stream: 'A', parentName: '', parentPhone: '',
      residence: '', feeBalance: 0
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleExcelUpload} 
        className="hidden" 
        accept=".csv" 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Student Repository</h2>
          <p className="text-sm text-slate-500 font-medium">Manage PP1 - Grade 9 CBC Enrollments</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {userRole === UserRole.ADMIN && (
            <>
              <button 
                onClick={handleExportExcel}
                className="flex-1 sm:flex-none bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200"
              >
                <Download className="w-5 h-5" /> Export List
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                {isUploading ? 'Importing...' : 'Excel Upload'}
              </button>
              <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" /> Enroll Learner
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row gap-4 border-b border-slate-100 bg-slate-50/30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search by Name, ADM or Grade..." 
              className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {privacyMode && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck className="w-3.5 h-3.5" /> Stealth Masking On
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Full Name & Bio</th>
                <th className="px-8 py-5">ADM</th>
                <th className="px-8 py-5">Gender</th>
                <th className="px-8 py-5">Grade / Stream</th>
                <th className="px-8 py-5">Residence</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 group transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center font-black shadow-sm ${student.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{student.name}</p>
                        <p className={`text-[10px] font-black uppercase transition-all ${privacyMode ? 'bg-slate-100 text-slate-100 blur-[2px] select-none rounded' : 'text-slate-400'}`}>
                          DOB: {student.dob}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-black text-slate-700">{student.admNo}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg ${student.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                      {student.gender}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-700 font-black">{student.grade}</span>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{student.stream}</p>
                  </td>
                  <td className="px-8 py-5">
                     <p className={`text-xs font-medium transition-all ${privacyMode ? 'blur-[4px] select-none text-slate-200' : 'text-slate-500'}`}>
                        {student.residence}
                     </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewingStudent(student)} className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                      {userRole === UserRole.ADMIN && (
                        <button onClick={() => confirmDelete(student)} className="p-3 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 font-black uppercase text-xs tracking-widest">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.student && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in" onClick={() => setDeleteModal({isOpen: false, student: null})} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative z-10 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight">Verify Deletion</h3>
             <p className="text-sm text-slate-500 text-center mt-2 font-medium">
               You are about to remove <span className="font-bold text-slate-900">{deleteModal.student.name}</span>. This action is irreversible.
             </p>
             <div className="mt-8 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">Type Admission No <span className="text-slate-900">{deleteModal.student.admNo}</span> to confirm</p>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="ADM NUMBER"
                  value={confirmAdm}
                  onChange={e => setConfirmAdm(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <button onClick={() => setDeleteModal({isOpen: false, student: null})} className="py-4 text-slate-400 font-black text-xs uppercase hover:text-slate-600">Dismiss</button>
                   <button 
                     disabled={confirmAdm !== deleteModal.student.admNo}
                     onClick={handleDelete}
                     className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${
                       confirmAdm === deleteModal.student.admNo ? 'bg-red-600 text-white shadow-red-100 hover:bg-red-700 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                     }`}
                   >
                     Confirm Delete
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setViewingStudent(null)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-10 text-center space-y-6">
              <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center font-black text-3xl mx-auto shadow-xl ${viewingStudent.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {viewingStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{viewingStudent.name}</h3>
                <p className="text-emerald-600 font-bold uppercase text-[10px] tracking-[0.2em]">{viewingStudent.grade} • Stream {viewingStudent.stream}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left pt-6">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Admission</p>
                   <p className="text-sm font-black text-slate-700">{viewingStudent.admNo}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Residence</p>
                   <p className={`text-sm font-black transition-all ${privacyMode ? 'blur-[4px]' : 'text-slate-700'}`}>{viewingStudent.residence}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Fee Balance</p>
                   <p className={`text-lg font-black transition-all ${privacyMode ? 'blur-[6px]' : 'text-slate-900'}`}>{maskBalance(viewingStudent.feeBalance)}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Parent/Guardian</p>
                   <p className="text-sm font-black text-slate-900">{viewingStudent.parentName}</p>
                   <p className={`text-xs font-bold mt-0.5 transition-all ${privacyMode ? 'blur-[4px]' : 'text-slate-500'}`}>{maskPhone(viewingStudent.parentPhone)}</p>
                 </div>
              </div>

              <button onClick={() => setViewingStudent(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsEnrollModalOpen(false)} />
           <form onSubmit={handleEnroll} className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl p-10 relative z-10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">New Learner Enrollment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Student Full Name</label>
                    <input type="text" required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none" placeholder="e.g. Kelvin Otieno" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Admission Number</label>
                    <input type="text" required value={newStudent.admNo} onChange={e => setNewStudent({...newStudent, admNo: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none" placeholder="e.g. 2024/001" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Grade Level</label>
                    <select value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none">
                       {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Initial Fee Balance (KES)</label>
                    <input type="number" required value={newStudent.feeBalance} onChange={e => setNewStudent({...newStudent, feeBalance: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none" placeholder="0.00" />
                 </div>
                 <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Parent / Guardian Details</h4>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Parent Name</label>
                    <input type="text" required value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Parent Phone Number</label>
                    <input type="text" required value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold outline-none" placeholder="+254..." />
                 </div>
              </div>
              <div className="flex justify-end gap-4 mt-10">
                 <button type="button" onClick={() => setIsEnrollModalOpen(false)} className="px-8 py-4 text-slate-500 font-black text-xs uppercase">Cancel</button>
                 <button type="submit" className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Enroll Learner</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default StudentsModule;
