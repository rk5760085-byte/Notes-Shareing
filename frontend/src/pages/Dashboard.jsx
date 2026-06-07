import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import { 
  Upload, 
  Bookmark, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('uploads'); // 'uploads', 'bookmarks', 'downloads'
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      setProfileData(res.data);
    } catch (err) {
      console.error('Error loading dashboard profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note? This action is permanent and will delete all associated downloads/comments.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await api.delete(`/notes/${id}`);
      // Refresh local profile
      await fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete note');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const uploads = profileData?.uploadedNotes || [];
  const bookmarks = profileData?.bookmarks || [];
  const downloads = profileData?.downloads || [];

  // Compute total downloads received on their uploaded notes
  const downloadsReceived = uploads.reduce((acc, note) => acc + (note.downloadCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Welcome banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-sm text-slate-350 font-medium">
              Manage your uploads, view bookmarks, and check download history.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/upload"
              className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-gradient-to-r from-primary-550 to-indigo-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-200"
            >
              <Upload className="h-4.5 w-4.5" />
              <span>Upload Notes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Uploads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Uploads</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{uploads.length}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400 rounded-xl">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>

        {/* Downloads Received */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Downloads Received</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{downloadsReceived}</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-450 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Downloaded Documents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Downloaded Files</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{downloads.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 rounded-xl">
            <Download className="h-6 w-6" />
          </div>
        </div>

        {/* Bookmarked Notes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Bookmarks</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{bookmarks.length}</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-xl">
            <Bookmark className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Tabs list */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 flex space-x-6">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'uploads'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          My Uploads ({uploads.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'bookmarks'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          My Bookmarks ({bookmarks.length})
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all duration-200 ${
            activeTab === 'downloads'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Download History ({downloads.length})
        </button>
      </div>

      {/* Tab Panel contents */}
      <div className="pt-2">
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            {uploads.length > 0 ? (
              <div className="overflow-hidden border border-slate-200/50 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-800/60 text-xs font-bold text-slate-450 uppercase tracking-wider">
                      <th className="p-4 sm:p-5">Note Title</th>
                      <th className="p-4 sm:p-5 hidden md:table-cell">Subject</th>
                      <th className="p-4 sm:p-5 hidden sm:table-cell">Semester</th>
                      <th className="p-4 sm:p-5 text-center">Stats</th>
                      <th className="p-4 sm:p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                    {uploads.map((note) => (
                      <tr key={note._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                        
                        {/* Title */}
                        <td className="p-4 sm:p-5">
                          <Link to={`/notes/${note._id}`} className="font-bold text-slate-800 dark:text-slate-150 hover:text-primary-500 transition-colors block">
                            {note.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-medium block md:hidden mt-0.5">
                            {note.subject} • {note.semester}
                          </span>
                        </td>

                        {/* Subject */}
                        <td className="p-4 sm:p-5 font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">
                          {note.subject}
                        </td>

                        {/* Semester */}
                        <td className="p-4 sm:p-5 font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                          {note.semester}
                        </td>

                        {/* Stats */}
                        <td className="p-4 sm:p-5">
                          <div className="flex items-center justify-center space-x-3 text-xs text-slate-500 font-bold">
                            <span className="flex items-center space-x-1" title="Downloads">
                              <Download className="h-3.5 w-3.5 text-slate-405" />
                              <span>{note.downloadCount}</span>
                            </span>
                            <span className="flex items-center space-x-1" title="Likes">
                              <Bookmark className="h-3.5 w-3.5 text-slate-405" />
                              <span>{note.likes?.length || 0}</span>
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 sm:p-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/notes/${note._id}`}
                              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            {/* We can route to an Edit page. Since we support edit, let's allow navigation to /upload with query edit=noteId */}
                            <Link
                              to={`/upload?edit=${note._id}`}
                              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 rounded-lg transition-colors"
                              title="Edit Note"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              disabled={deleteLoading}
                              className="p-2 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete Note"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12 px-4 space-y-4">
                <div className="p-4 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-full w-fit mx-auto">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">No uploads yet</h3>
                  <p className="text-sm text-slate-400">Share your exam summaries and lecture logs with your peers.</p>
                </div>
                <Link
                  to="/upload"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  <span>Upload Your First Note</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookmarks.map((note) => (
                  <NoteCard 
                    key={note._id} 
                    note={note} 
                    onBookmarkUpdate={(noteId, isBookmarked) => {
                      if (!isBookmarked) {
                        // Remove from active view if unbookmarked
                        setProfileData((prev) => ({
                          ...prev,
                          bookmarks: prev.bookmarks.filter((b) => b._id !== noteId && b !== noteId)
                        }));
                      }
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12 px-4 space-y-3">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full w-fit mx-auto">
                  <Bookmark className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">No bookmarked notes</h3>
                  <p className="text-sm text-slate-400">Bookmark useful lecture outlines to find them quickly here.</p>
                </div>
                <Link to="/notes" className="text-sm font-bold text-primary-500 hover:underline">
                  Browse study guides
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'downloads' && (
          <div>
            {downloads.length > 0 ? (
              <div className="overflow-hidden border border-slate-200/50 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-800/60 text-xs font-bold text-slate-450 uppercase tracking-wider">
                      <th className="p-4 sm:p-5">Note Title</th>
                      <th className="p-4 sm:p-5">Author</th>
                      <th className="p-4 sm:p-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                    {downloads.map((note) => (
                      <tr key={note._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-slate-855 dark:text-slate-150">
                          <Link to={`/notes/${note._id}`} className="hover:text-primary-500">
                            {note.title}
                          </Link>
                        </td>
                        <td className="p-4 sm:p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {note.author?.name || note.authorName || 'Anonymous'}
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <Link
                            to={`/notes/${note._id}`}
                            className="inline-flex items-center space-x-1 text-xs font-bold text-primary-500 hover:underline"
                          >
                            <span>Open Note</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-12 px-4 space-y-3">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full w-fit mx-auto">
                  <Download className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">No download logs</h3>
                  <p className="text-sm text-slate-400">Downloaded notes will show up here for offline reference.</p>
                </div>
                <Link to="/notes" className="text-sm font-bold text-primary-500 hover:underline">
                  Explore notes catalog
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
