import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { UserPlus, Shield, Mail, Lock, Loader2, CheckCircle2, Users } from 'lucide-react';

export function UserManagementView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Division Coordinator');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [profiles, setProfiles] = useState([]);
  const [fetchingProfiles, setFetchingProfiles] = useState(true);

  const fetchProfiles = async () => {
    setFetchingProfiles(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProfiles(data || []);
    setFetchingProfiles(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });

      if (error) throw error;

      setSuccessMsg(`Successfully created account for ${email}!`);
      setEmail('');
      setPassword('');
      fetchProfiles(); // Refresh the directory table
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      fetchProfiles();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">User & Role Management</h2>
        <p className="text-sm text-slate-500">Provision authorized credentials and manage access privileges across SGOD.</p>
      </div>

      {/* CREATE USER FORM */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 bg-blue-50 text-[#003366] rounded-xl">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Create New System User</h3>
            <p className="text-xs text-slate-500">Accounts automatically sync to the division directory.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                placeholder="coordinator@deped.gov.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Temporary Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Access Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Division Coordinator">Division Coordinator</option>
                <option value="School Head">School Head</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-3 pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-[#003366] text-yellow-400 font-semibold rounded-xl text-sm hover:bg-blue-900 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Provision Account'}
            </button>
          </div>
        </form>
      </div>

      {/* REGISTERED ACCOUNTS DIRECTORY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#003366]" />
            <h3 className="text-lg font-bold text-slate-800">Active System Accounts</h3>
          </div>
          {fetchingProfiles && <Loader2 className="animate-spin text-[#003366]" size={18} />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                <th className="pb-3">User Email</th>
                <th className="pb-3">Assigned Role</th>
                <th className="pb-3">Date Provisioned</th>
                <th className="pb-3 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="py-4 font-medium text-slate-900">{profile.email}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      profile.role === 'Super Admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : profile.role === 'Division Coordinator'
                        ? 'bg-blue-100 text-[#003366]'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="py-4 text-slate-500">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right">
                    <select
                      value={profile.role}
                      onChange={(e) => handleRoleUpdate(profile.id, e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Division Coordinator">Division Coordinator</option>
                      <option value="School Head">School Head</option>
                    </select>
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