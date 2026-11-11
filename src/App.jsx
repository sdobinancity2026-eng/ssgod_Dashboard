import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  FileSpreadsheet, 
  Building2, 
  ClipboardCheck, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  TrendingUp, 
  Award,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl">
        {/* Header / Logo */}
        <div className="p-5 border-b border-blue-900 flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg text-[#003366] font-bold">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SGOD Dashboard</h1>
            <p className="text-xs text-blue-200">Schools Division Office</p>
          </div>
        </div>

        {/* Navigation Links */}
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

        {/* User / Footer */}
        <div className="p-4 border-t border-blue-900">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-200 hover:bg-red-500/20 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
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

        {/* MAIN DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Schools Division Dashboard</h2>
              <p className="text-sm text-slate-500">Overview of operations, programs, and school metrics.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                Generate Report
              </button>
              <button className="px-4 py-2 bg-[#003366] text-yellow-400 rounded-lg text-sm font-semibold hover:bg-blue-900 shadow">
                + Add New Record
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Public Schools</span>
                <span className="p-2 bg-blue-50 text-[#003366] rounded-xl"><School size={20} /></span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">48</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp size={14} /> +2 new integrated schools
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Programs</span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><BookOpen size={20} /></span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">14</h3>
              <p className="text-xs text-slate-500">Across 5 SGOD units</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monitored Schools</span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ClipboardCheck size={20} /></span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">96%</h3>
              <p className="text-xs text-emerald-600 font-medium">Q3 M&E Compliance</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stakeholder Partners</span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Award size={20} /></span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">128</h3>
              <p className="text-xs text-purple-600 font-medium">Adopt-A-School Active</p>
            </div>
          </div>

          {/* RECENT ACTIVITY TABLE SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Recent Division Activities & Submissions</h3>
              <button className="text-sm font-semibold text-[#003366] hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="pb-3">School / Unit</th>
                    <th className="pb-3">Program / Activity</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date Submitted</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-4 font-medium text-slate-900">Biñan National High School</td>
                    <td className="py-4">ARAL Program Implementation Report</td>
                    <td className="py-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Completed</span></td>
                    <td className="py-4 text-slate-500">Nov 10, 2026</td>
                    <td className="py-4 text-right"><button className="text-[#003366] font-semibold hover:underline">Review</button></td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-slate-900">Timbao Elementary School</td>
                    <td className="py-4">WASH in Schools (WinS) Assessment</td>
                    <td className="py-4"><span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending Review</span></td>
                    <td className="py-4 text-slate-500">Nov 09, 2026</td>
                    <td className="py-4 text-right"><button className="text-[#003366] font-semibold hover:underline">Review</button></td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-slate-900">Platero Elementary School</td>
                    <td className="py-4">School Improvement Plan (SIP) Update</td>
                    <td className="py-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Completed</span></td>
                    <td className="py-4 text-slate-500">Nov 07, 2026</td>
                    <td className="py-4 text-right"><button className="text-[#003366] font-semibold hover:underline">Review</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}