import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { UserPlus, Shield, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';

export function UserManagementView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Division Coordinator');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Using Supabase Auth signUp to create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          }
        }
      });

      if (error) throw error;

      setSuccessMsg(`Successfully created account for ${email}!`);
      setEmail('');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">User & Role Management</h2>
        <p className="text-sm text-slate-500">Provision authorized access credentials for division personnel and school heads.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 bg-blue-50 text-[#003366] rounded-xl">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Create New System User</h3>
            <p className="text-xs text-slate-500">New users will be able to log in immediately using these credentials.</p>
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

        <form onSubmit={handleCreateUser} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Access Role & Privileges</label>
            <div className="relative">
              <Shield className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="Super Admin">Super Admin (Full Division Access)</option>
                <option value="Division Coordinator">Division Coordinator (M&E / Reviewer)</option>
                <option value="School Head">School Head (Submissions Only)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-[#003366] text-yellow-400 font-semibold rounded-xl text-sm hover:bg-blue-900 transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create User Account'}
          </button>
        </form>
      </div>
    </div>
  );
}