
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Eye, MapPin, Phone } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { Student } from '../types';

const StudentsModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState<Student[]>(MOCK_STUDENTS);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.admNo.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-slate-500">Manage and view all students currently enrolled.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors">
          <Plus className="w-5 h-5" />
          Enroll Student
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or admission number..." 
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Grade & Stream</th>
                <th className="px-6 py-4">Parent Details</th>
                <th className="px-6 py-4">Residence</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">ADM: {student.admNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {student.grade} - {student.stream}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <div className="flex flex-col">
                      <span className="font-medium">{student.parentName}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {student.parentPhone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {student.residence}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white rounded-lg hover:text-emerald-600 shadow-sm border border-transparent hover:border-slate-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-200">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg hover:text-red-600 shadow-sm border border-transparent hover:border-slate-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-2 group-hover:hidden">
                       <MoreVertical className="w-4 h-4" />
                    </button>
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

export default StudentsModule;
