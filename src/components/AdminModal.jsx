import React, { useState, useEffect } from 'react';
import { useCV } from '../context/CVContext';
import {
  X,
  ShieldAlert,
  Users,
  Database,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export const AdminModal = ({ isOpen, onClose }) => {
  const { user, adminUsers, adminStats, fetchAdminData, t, language } = useCV();
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = user && (user.role === 'admin' || user.email?.includes('admin') || user.email === 'admin@toolcv.com');

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchAdminData();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {language === 'km' ? 'មិនមានសិទ្ធិចូលមើល (Access Denied)' : 'Access Restricted'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {language === 'km' ? 'ទំព័រនេះសម្រាប់តែគណនី Admin ប៉ុណ្ណោះ។' : 'Only Administrator accounts can view this database.'}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            {language === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = adminUsers.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.provider && u.provider.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>MySQL & Admin Database Management</span>
                <span className="px-2 py-0.5 text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full font-bold uppercase">
                  Admin
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'km'
                  ? 'គ្រប់គ្រងបញ្ជី User និងព័ត៌មានគណនីទាំងអស់ដែលបានចុះឈ្មោះក្នុង MySQL Database'
                  : 'Monitor and manage all user accounts and registered phone numbers stored in MySQL'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition mr-8"
            title="Refresh database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Total Users</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {adminStats?.totalUsers || adminUsers.length}
            </div>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Phone Verified Accounts</div>
            <div className="text-xl font-bold text-blue-400 mt-0.5">
              {adminStats?.phoneAccounts || adminUsers.filter(u => u.phone).length}
            </div>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Social Accounts (FB/Google)</div>
            <div className="text-xl font-bold text-purple-400 mt-0.5">
              {adminStats?.socialAccounts || adminUsers.filter(u => u.provider !== 'local').length}
            </div>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Storage Engine</div>
            <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>{adminStats?.isMySqlConnected ? 'MySQL Connected' : 'Persistent Storage'}</span>
            </div>
          </div>
        </div>

        {/* Search Filter Bar */}
        <div className="relative mb-3 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, phone number, email, or provider (e.g. 012, Google, Facebook)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Users Table */}
        <div className="flex-1 overflow-y-auto custom-scroll border border-slate-800 rounded-xl bg-slate-950/50">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No users found matching your search.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">User / Name</th>
                  <th className="py-2.5 px-3">Phone Number</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 px-3 flex items-center gap-2">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                      <span className="font-semibold text-white">{u.name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">
                      {u.phone || <span className="text-slate-500 italic">Not set</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.provider === 'google'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : u.provider === 'facebook'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {u.provider || 'Local'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {u.created_at || u.createdAt
                        ? new Date(u.created_at || u.createdAt).toLocaleDateString()
                        : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
