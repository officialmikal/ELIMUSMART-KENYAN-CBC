
import React, { useState } from 'react';
import { Search, Plus, Filter, Trash2, Eye, MapPin, Phone, AlertTriangle, X, UserPlus, Calendar, ShieldAlert, UserCircle } from 'lucide-react';
import { MOCK_STUDENTS, GRADES, YEARS } from '../constants';
import { Student, UserRole } from '../types';

interface StudentsModuleProps {
  userRole: UserRole;
}

const StudentsModule: React.FC<StudentsModuleProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
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
      setStudents(students.filter(s => s.id !== deleteModal.student?.id));
      setDeleteModal({ isOpen: false, student: null });
    }
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    const studentToAdd = {
      ...newStudent,
      id: Date.now().toString(),
    } as Student;
    setStudents([studentToAdd, ...students]);
    setIsEnrollModalOpen(false);
    // Reset form
    setNewStudent({
      name: '', admNo: '', gender: 'Male', dob: '2015-01-01',
      grade: 'PP1', stream: 'A', parentName: '', parentPhone: '',
      residence: '', feeBalance: 0
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Student Repository</h2>
          <p className="text-sm text-slate-500 font-medium">Manage PP1 - Grade 9 CBC Enrollments</p>
        </div>
        {userRole === UserRole.ADMIN && (
          <button 
            onClick={() => setIsEnrollModalOpen(true)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Enroll Learner
          </button>
        )}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search by Name, ADM or Grade..." 
              className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                        <p className="text-[10px] text-slate-400 font-black uppercase">DOB: {student.dob}</p>
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
                  <td className="px-8 py-5 text-xs font-medium text-slate-500">{student.residence}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setViewingStudent(student)}
                        className="p-3 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {userRole === UserRole.ADMIN && (
                        <button 
                          onClick={() => confirmDelete(student)}
                          className="p-3 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

      {/* Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsEnrollModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <UserPlus className="w-7 h-7 text-emerald-400" />
                <h3 className="text-2xl font-black uppercase">Enroll Learner</h3>
              </div>
              <button onClick={() => setIsEnrollModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleEnroll} className="p-8 overflow-y-auto space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Student Full Name</label>
                   <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Admission Number</label>
                   <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newStudent.admNo} onChange={e => setNewStudent({...newStudent, admNo: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                   <div className="flex gap-2">
                     <button type="button" onClick={() => setNewStudent({...newStudent, gender: 'Male'})} className={`flex-1 p-4 rounded-2xl border-2 font-black text-xs ${newStudent.gender === 'Male' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100'}`}>Male</button>
                     <button type="button" onClick={() => setNewStudent({...newStudent, gender: 'Female'})} className={`flex-1 p-4 rounded-2xl border-2 font-black text-xs ${newStudent.gender === 'Female' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100'}`}>Female</button>
                   </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Birth</label>
                    <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newStudent.dob} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Grade / Level</label>
                   <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})}>
                     {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Residence / Estate</label>
                   <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newStudent.residence} onChange={e => setNewStudent({...newStudent, residence: e.target.value})} />
                 </div>
               </div>

               <div className="pt-6 border-t border-slate-100 space-y-6">
                  <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">Parent / Guardian Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Parent Name</label>
                      <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                      <input required type="text" placeholder="+254..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" value={newStudent.parentPhone} onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})} />
                    </div>
                  </div>
               </div>

               <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Complete Enrollment</button>
            </form>
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
                   <p className="text-sm font-black text-slate-700">{viewingStudent.residence}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Parent/Guardian</p>
                   <p className="text-sm font-black text-slate-900">{viewingStudent.parentName}</p>
                   <p className="text-xs font-bold text-slate-500 mt-0.5">{viewingStudent.parentPhone}</p>
                 </div>
              </div>

              <button onClick={() => setViewingStudent(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setDeleteModal({isOpen: false, student: null})} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-[28px] flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Critical Confirmation</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                You are permanently removing <span className="font-bold text-red-600">{deleteModal.student?.name}</span>. 
                Enter ADM No. <span className="font-black text-slate-900">"{deleteModal.student?.admNo}"</span> to authorize.
              </p>
              
              <input 
                type="text" 
                placeholder="Confirm Admission No."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-sm font-black mb-6 outline-none focus:ring-2 focus:ring-red-500"
                value={confirmAdm}
                onChange={e => setConfirmAdm(e.target.value)}
              />

              <div className="space-y-3">
                <button 
                  disabled={confirmAdm !== deleteModal.student?.admNo}
                  onClick={handleDelete}
                  className={`w-full py-5 rounded-[24px] font-black text-sm transition-all shadow-xl active:scale-95 ${
                    confirmAdm === deleteModal.student?.admNo 
                      ? 'bg-red-600 text-white shadow-red-200 hover:bg-red-700' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  Confirm & Wipe Records
                </button>
                <button 
                  onClick={() => setDeleteModal({isOpen: false, student: null})}
                  className="w-full py-5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-[24px] transition-colors"
                >
                  Cancel / Keep Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsModule;
