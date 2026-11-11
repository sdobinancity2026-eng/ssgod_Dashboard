import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { School, Search, Filter, CheckCircle2, Clock, AlertTriangle, Plus, Loader2 } from 'lucide-react';

// ==========================================
// 1. SCHOOL MANAGEMENT VIEW
// ==========================================
export function SchoolManagementView() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('school_name', { ascending: true });

    if (!error) setSchools(data || []);
    setLoading(false);
  };

  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.school_name.toLowerCase().includes(search.toLowerCase()) || 
                          s.school_id.includes(search);
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">School Management</h2>
          <p className="text-sm text-slate-500">Directory and operational profiles of schools within the division.</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 justify-between items-center">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by school name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
          >
            <option value="All">All Categories</option>
            <option value="Elementary">Elementary</option>
            <option value="High School">High School</option>
            <option value="Integrated">Integrated</option>
          </select>
        </div>
      </div>

      {/* SCHOOL CARDS GRID */}
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#003366]" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <div key={school.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-[#003366] rounded-xl">
                  <School size={24} />
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  {school.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{school.school_name}</h3>
              <p className="text-xs text-slate-500 mb-4">ID: {school.school_id} • {school.category}</p>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>SGOD Monitoring Active</span>
                <button className="text-[#003366] font-semibold hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. MONITORING & EVALUATION VIEW
// ==========================================
export function MonitoringEvaluationView({ activities, onStatusChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Monitoring & Evaluation (M&E)</h2>
        <p className="text-sm text-slate-500">Review quality assurance, compliance reports, and division assessments.</p>
      </div>

      {/* M&E METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Verified & Approved</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {activities.filter(a => a.status === 'Completed').length} Submissions
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-100 text-amber-700 rounded-2xl">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Pending Review</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {activities.filter(a => a.status === 'Pending Review').length} Submissions
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-[#003366] rounded-2xl">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Target Compliance Rate</p>
            <h3 className="text-2xl font-bold text-slate-800">96.4%</h3>
          </div>
        </div>
      </div>

      {/* INTERACTIVE COMPLIANCE TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Submission Quality Assurance Checklist</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                <th className="pb-3">School Name</th>
                <th className="pb-3">Report / Program</th>
                <th className="pb-3">Date Submitted</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {activities.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 font-medium text-slate-900">{item.school_name}</td>
                  <td className="py-4">{item.program_activity}</td>
                  <td className="py-4 text-slate-500">{item.date_submitted}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'Completed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {item.status === 'Pending Review' && (
                      <button 
                        onClick={() => onStatusChange(item.id, 'Completed')}
                        className="px-3 py-1.5 bg-[#003366] text-yellow-400 font-semibold text-xs rounded-lg hover:bg-blue-900 shadow-sm"
                      >
                        Approve & Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. GENERIC SECTION PLACEHOLDER
// ==========================================
export function GenericUnitView({ title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto my-8">
      <div className="w-16 h-16 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
        SGOD
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 text-sm mb-6">{description}</p>
      <button className="px-5 py-2.5 bg-[#003366] text-yellow-400 font-semibold rounded-xl text-sm hover:bg-blue-900 shadow">
        Configure {title} Modules
      </button>
    </div>
  );
}