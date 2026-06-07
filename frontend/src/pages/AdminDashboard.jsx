import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  LayoutDashboard,
  UserX,
  FileX,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // UX states
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'notes'
  const [actionLoading, setActionLoading] = useState(false);
  
  // Search states
  const [userQuery, setUserQuery] = useState('');
  const [noteQuery, setNoteQuery] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      const notesRes = await api.get('/admin/notes');
      setNotes(notesRes.data);

    } catch (err) {
      console.error('Failed to retrieve administrative datasets:', err);
      // Fallback redirect if unauthorized
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`WARNING: Are you sure you want to delete user "${name}"? This will permanently delete their account, all their uploaded notes, comments, likes, and bookmarks. This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(true);
      await api.delete(`/admin/users/${userId}`);
      alert(`User ${name} and all their data deleted successfully.`);
      await fetchAdminData(); // Reload statistics
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNote = async (noteId, title) => {
    if (!window.confirm(`Are you sure you want to delete note "${title}"? This will delete the PDF file and all comments.`)) {
      return;
    }

    try {
      setActionLoading(true);
      await api.delete(`/notes/${noteId}`); // noteController checks admin
      alert(`Note "${title}" removed successfully.`);
      await fetchAdminData(); // Reload
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete note.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-slate-550 dark:text-slate-400 font-medium">Bootstrapping admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(noteQuery.toLowerCase()) || 
    n.subject.toLowerCase().includes(noteQuery.toLowerCase()) ||
    n.authorName?.toLowerCase().includes(noteQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
            Platform analytics, user audits, and study documents content moderation.
          </p>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Notes ({notes.length})
          </button>
        </div>
      </div>

      {/* OVERVIEW PANEL */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Notes</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totalNotes}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 text-purple-650 dark:text-purple-400 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Downloads</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totalDownloads}</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-450 rounded-xl">
                <Download className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Students</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.activeUsers}</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-550 dark:text-amber-400 rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Recent users list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Clock className="h-4.5 w-4.5 text-slate-400" />
                <span>Recently Registered Users</span>
              </h3>
              <div className="space-y-3">
                {stats.recentUsers?.map((u) => (
                  <div key={u._id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100/50 dark:border-slate-850/50 last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                    <span className="px-2 py-0.5 font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular notes list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <FolderOpen className="h-4.5 w-4.5 text-slate-400" />
                <span>Most Popular Documents</span>
              </h3>
              <div className="space-y-3">
                {stats.popularNotes?.map((n) => (
                  <div key={n._id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100/50 dark:border-slate-850/50 last:border-0 last:pb-0">
                    <div className="space-y-0.5 min-w-0 pr-4">
                      <Link to={`/notes/${n._id}`} className="font-bold text-slate-800 dark:text-slate-200 hover:text-primary-500 truncate block">
                        {n.title}
                      </Link>
                      <p className="text-[10px] text-slate-400">By {n.author?.name || n.authorName}</p>
                    </div>
                    <span className="font-bold text-slate-500 shrink-0 flex items-center space-x-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>{n.downloadCount}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* User Search */}
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 text-sm"
              placeholder="Search users by name or email..."
            />
          </div>

          {/* User List Table */}
          <div className="overflow-hidden border border-slate-200/50 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-800/60 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Name / Email</th>
                  <th className="p-4 sm:p-5">Joined Date</th>
                  <th className="p-4 sm:p-5">Account Role</th>
                  <th className="p-4 sm:p-5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition-colors">
                      
                      <td className="p-4 sm:p-5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-150">{u.name}</p>
                          <p className="text-xs text-slate-400 font-semibold">{u.email}</p>
                        </div>
                      </td>

                      <td className="p-4 sm:p-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 sm:p-5 text-xs">
                        <span className={`px-2.5 py-0.5 font-bold rounded-md capitalize ${
                          u.role === 'admin' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100/30' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4 sm:p-5 text-right">
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            disabled={actionLoading}
                            className="p-2 bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete User Account"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium pr-2">Protected</span>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-xs font-bold text-slate-400">
                      No matching user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* NOTES MODERATION */}
      {activeTab === 'notes' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Note Search */}
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              value={noteQuery}
              onChange={(e) => setNoteQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 text-sm"
              placeholder="Search notes by title, subject, or author..."
            />
          </div>

          {/* Notes List Table */}
          <div className="overflow-hidden border border-slate-200/50 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-800/60 text-xs font-bold text-slate-450 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Note Details</th>
                  <th className="p-4 sm:p-5">Uploader</th>
                  <th className="p-4 sm:p-5 text-center">Downloads</th>
                  <th className="p-4 sm:p-5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition-colors">
                      
                      {/* Details */}
                      <td className="p-4 sm:p-5">
                        <div className="space-y-0.5">
                          <Link to={`/notes/${note._id}`} className="font-bold text-slate-800 dark:text-slate-150 hover:text-primary-500 block">
                            {note.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            {note.subject} • {note.semester}
                          </span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="p-4 sm:p-5">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
                            {note.author?.name || note.authorName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {note.author?.email || 'N/A'}
                          </p>
                        </div>
                      </td>

                      {/* Downloads */}
                      <td className="p-4 sm:p-5 text-center font-bold text-slate-500 text-xs">
                        {note.downloadCount}
                      </td>

                      {/* Moderation actions */}
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/notes/${note._id}`}
                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-300 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Preview note content"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteNote(note._id, note.title)}
                            disabled={actionLoading}
                            className="p-2 bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                            title="Flag and Delete Note"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-xs font-bold text-slate-400">
                      No matching note documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
