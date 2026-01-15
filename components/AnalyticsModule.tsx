
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, Users, GraduationCap, Banknote } from 'lucide-react';

const PERFORMANCE_DATA = [
  { subject: 'Math', average: 74 },
  { subject: 'English', average: 82 },
  { subject: 'Kiswahili', average: 68 },
  { subject: 'Science', average: 79 },
  { subject: 'History', average: 71 },
];

const REVENUE_DATA = [
  { month: 'Jan', amount: 1200000 },
  { month: 'Feb', amount: 2400000 },
  { month: 'Mar', amount: 1800000 },
  { month: 'Apr', amount: 900000 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const AnalyticsModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">School Insights</h2>
          <p className="text-slate-500">Visual data on academic performance and financial health.</p>
        </div>
        <div className="flex gap-2">
           <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 shadow-sm focus:outline-none">
             <option>Term 1, 2024</option>
             <option>Year 2023</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              Subject Performance (Average %)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="average" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Finance Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              Fee Collection Trend
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
          <h3 className="font-bold text-slate-800 mb-6">Student Distribution</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Primary', value: 400 },
                    { name: 'JSS', value: 300 },
                    { name: 'Secondary', value: 300 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2">
          <h3 className="font-bold text-slate-800 mb-6">Top Performing Students</h3>
          <div className="space-y-4">
            {[
              { name: 'Jane Kamau', score: '98%', grade: 'Grade 6', avatar: 'JK' },
              { name: 'Amos Kiprono', score: '96%', grade: 'Grade 7', avatar: 'AK' },
              { name: 'Sarah Wambui', score: '95%', grade: 'Grade 6', avatar: 'SW' },
            ].map((student, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {student.avatar}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800">{student.name}</p>
                       <p className="text-xs text-slate-500">{student.grade}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">{student.score}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Aggregate</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;
