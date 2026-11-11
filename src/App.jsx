import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import { SchoolManagementView, MonitoringEvaluationView, GenericUnitView } from './ModuleViews';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  FileSpreadsheet, 
  Building2, 
  ClipboardCheck, 
  LogOut, 
  Bell, 
  Search, 
  TrendingUp, 
  Award,
  BookOpen,
  Plus,
  Loader2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activities, setActivities] = useState([]);
  const [schoolCount, setSchoolCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    school_name: '',
    program_activity: '',
    status: 'Pending Review'
  });

  const [session, setSession] = useState(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => subscription.unsubscribe();
}, []);

const handleSignOut = async () => {
  await supabase.auth.signOut();
};

if (!session) {
  return <Login onLoginSuccess={(sess) => setSession(sess)} />;
}

  const fetchData = async () => {
    setLoading(true);
    try {
      const { count: sCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });
      setSchoolCount(sCount || 0);

      const { data: actData } = await supabase
        .from('activities')
        .select('*')
        .order('date_submitted', { ascending: false });
      setActivities(actData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.school_name || !formData.program_activity) return;

    const { error } = await supabase.from('activities').insert([
      {
        school_name: formData.school_name,
        program_activity: formData.program_activity,
        status: formData.status,
        date_submitted: new Date().toISOString().split('T')[0]
      }
    ]);

    if (!error) {
      setShowModal(false);
      setFormData({ school_name: '', program_activity: '', status: 'Pending Review' });
      fetchData();
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('activities')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) fetchData();
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl">
        <div className="p-5 border-b border-blue-900 flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg text-[#003366] font-bold">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SGOD Dashboard</h1>
            <p className="text-xs text-blue-200">Schools Division Office</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-yellow-400 text-[#003366] font-semibold shadow-md' : 'text-blue-100 hover:bg-blue-900/50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab('schools')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'schools' ? 'bg-yellow-400 text-[#003366] font-semibold shadow-md' : 'text-blue-100 hover:bg-blue-900/50'}`}
          >
            <School size={20} /> School Management
          </button>
          <button 
            onClick={() => setActiveTab('monitoring')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'monitoring' ? 'bg-yellow-400 text-[#003366] font-semibold shadow-md' : 'text-blue-100 hover:bg-blue-900/50'}`}
          >
            <ClipboardCheck size={20} /> Monitoring & Evaluation
          </button>
          <button 
            onClick={() => setActiveTab('hrd')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'hrd' ? 'bg-yellow-400 text-[#003366] font-semibold shadow-md' : 'text-blue-100 hover:bg-blue-900/50'}`}
          >
            <Users size={20} /> Human Resource Dev.
          </button>
          <button 
            onClick={() => setActiveTab('social')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'social' ? 'bg-yellow-400 text-[#003366] font-semibold shadow-md' : 'text-blue-100 hover:bg-blue-900/50'}`}
          >
            <Building2 size={20} /> Social Mobilization
          </button>
          <button 
            onClick={() => setActiveTab('facilities')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'facilities' ? 'bg-yellow-400 text-[#003366] font-semibold shadow-md' : 'text-blue-100 hover:bg-blue-900/50'}`}
          >
            <FileSpreadsheet size={20} /> Physical Facilities
          </button>
        </nav>

        <div className="p-4 border-t border-blue-900">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-200 hover:bg-red-500/20 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search schools, programs, reports..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#003366] text-yellow-400 font-bold flex items-center justify-center text-sm shadow">
                SG
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">SGOD Division</p>
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC VIEW ROUTER */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Schools Division Dashboard</h2>
                  <p className="text-sm text-slate-500">Live operation data synced directly with Supabase database.</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-[#003366] text-yellow-400 rounded-lg text-sm font-semibold hover:bg-blue-900 shadow flex items-center gap-2"
                >
                  <Plus size={16} /> Add New Record
                </button>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Public Schools</span>
                    <span className="p-2 bg-blue-50 text-[#003366] rounded-xl"><School size={20} /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">{schoolCount}</h3>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <TrendingUp size={14} /> Live database count
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Submissions Logged</span>
                    <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><BookOpen size={20} /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">{activities.length}</h3>
                  <p className="text-xs text-slate-500">Recorded in SGOD</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monitored Rate</span>
                    <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ClipboardCheck size={20} /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">96%</h3>
                  <p className="text-xs text-emerald-600 font-medium">Q3 M&E Target</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stakeholder Partners</span>
                    <span className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Award size={20} /></span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">128</h3>
                  <p className="text-xs text-purple-600 font-medium">Adopt-A-School</p>
                </div>
              </div>

              {/* TABLE */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Recent Division Activities & Submissions</h3>
                  {loading && <Loader2 className="animate-spin text-[#003366]" size={20} />}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                        <th className="pb-3">School / Unit</th>
                        <th className="pb-3">Program / Activity</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {activities.map((item) => (
                        <tr key={item.id}>
                          <td className="py-4 font-medium text-slate-900">{item.school_name}</td>
                          <td className="py-4">{item.program_activity}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'Completed' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 text-slate-500">{item.date_submitted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'schools' && <SchoolManagementView />}
          {activeTab === 'monitoring' && (
            <MonitoringEvaluationView 
              activities={activities} 
              onStatusChange={handleUpdateStatus} 
            />
          )}
          {activeTab === 'hrd' && (
            <GenericUnitView 
              title="Human Resource Development" 
              description="Manage training programs, professional development records, and personnel capacity building." 
            />
          )}
          {activeTab === 'social' && (
            <GenericUnitView 
              title="Social Mobilization & Networking" 
              description="Track Adopt-A-School partners, stakeholder pledges, and community initiatives." 
            />
          )}
          {activeTab === 'facilities' && (
            <GenericUnitView 
              title="Physical Facilities Section" 
              description="Monitor school building repairs, classroom inventory, and infrastructure projects." 
            />
          )}
        </main>
      </div>

      {/* ADD RECORD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add Division Submission Record</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">School Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Timbao Elementary School"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  value={formData.school_name}
                  onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Program / Activity</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. ARAL Program Report"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  value={formData.program_activity}
                  onChange={(e) => setFormData({...formData, program_activity: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#003366] text-yellow-400 font-semibold rounded-lg text-sm hover:bg-blue-900"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}