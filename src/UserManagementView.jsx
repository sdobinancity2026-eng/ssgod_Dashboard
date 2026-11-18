import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { UserPlus, Shield, Mail, Lock, Loader2, CheckCircle2, Users, User, X, Edit3, PlusCircle } from 'lucide-react';

export function UserManagementView() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Division Coordinator');
  
  const [editingUserId, setEditingUserId] = useState(null); // Tracks if we are editing an existing user
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingUserId) {
        // UPDATE EXISTING USER PROFILE
        const { error } = await supabase
          .from('profiles')
          .update({ 
            full_name: fullName, 
            role: role 
          })
          .eq('id', editingUserId);

        if (error) throw error;
        setSuccessMsg(`Successfully updated profile for ${fullName}!`);
      } else {
        // CREATE NEW USER ACCOUNT
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              role,
              full_name: fullName 
            }
          }
        });

        if (error) throw error;
        setSuccessMsg(`Successfully created account for ${fullName} (${email})!`);
      }

      handleReset();
      fetchProfiles();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUserToEdit = (profile) => {
    setEditingUserId(profile.id);
    setFullName(profile.full_name || '');
    setEmail(profile.email || '');
    setPassword(''); // Password cannot be edited from client side for security reasons
    setRole(profile.role || 'Division Coordinator');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleReset = () => {
    setEditingUserId(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('Division Coordinator');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User & Role Management</h2>
          <p className="text-sm text-slate-500">Provision credentials and manage access privileges across division personnel.</p>
        </div>
        {editingUserId && (
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-[#003366] text-yellow-400 hover:bg-blue-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle size={16} /> Switch to Create New User
          </button>
        )}
      </div>

      {/* CREATE / EDIT USER FORM */}
      <div className={`bg-white rounded-2xl shadow-sm border p-8 transition-all ${editingUserId ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${editingUserId ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#003366]'}`}>
              {editingUserId ? <Edit3 size={24} /> : <UserPlus size={24} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                {editingUserId ? `Editing User: ${fullName || email}` : 'Create New System User'}
              </h3>
              <p className="text-xs text-slate-500">
                {editingUserId ? 'Modify user name or access role below.' : 'Fill out details to provision a new account.'}
              </p>
            </div>
          </div>
          {editingUserId && (
            <button 
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <X size={14} /> Cancel Edit
            </button>
          )}
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

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                placeholder="e.g. Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                disabled={editingUserId !== null} 
                placeholder="name@deped.gov.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${editingUserId ? 'bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
          </div>

          {!editingUserId && (
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
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>
          )}

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

          <div className="md:col-span-2 pt-2 flex gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className={`px-6 py-2.5 font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 ${editingUserId ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-[#003366] text-yellow-400 hover:bg-blue-900'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (editingUserId ? 'Update User Details' : 'Provision Account')}
            </button>
            {editingUserId && (
              <button 
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* REGISTERED ACCOUNTS DIRECTORY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#003366]" />
            <h3 className="text-lg font-bold text-slate-800">Active System Accounts</h3>
            <span className="text-xs text-slate-400 ml-2">(Click any row to edit)</span>
          </div>
          {fetchingProfiles && <Loader2 className="animate-spin text-[#003366]" size={18} />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                <th className="pb-3">Full Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Assigned Role</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {profiles.map((profile) => (
                <tr 
                  key={profile.id} 
                  onClick={() => handleSelectUserToEdit(profile)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-4 font-medium text-slate-900">
                    {profile.full_name || 'N/A'}
                  </td>
                  <td className="py-4 text-slate-500">{profile.email}</td>
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
                  <td className="py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectUserToEdit(profile);
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-[#003366] hover:text-yellow-400 text-slate-700 rounded-lg text-xs font-medium transition-all"
                    >
                      Edit User
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
}