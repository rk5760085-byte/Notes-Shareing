import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Download, 
  ThumbsUp, 
  Bookmark, 
  User, 
  Calendar, 
  Send, 
  Trash2, 
  FileText,
  AlertCircle,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

const NoteDetails = () => {
  const { id } = useParams();
  const { user, toggleBookmark } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments states
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch note details
  const fetchNoteDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/notes/${id}`);
      const data = res.data;
      setNote(data);
      
      // Set likes states
      setLikesCount(data.likes?.length || 0);
      if (user) {
        setIsLiked(data.likes?.includes(user._id));
        setIsBookmarked(user.bookmarks.some((b) => (b._id || b) === data._id));
      }
    } catch (err) {
      console.error('Error fetching note details:', err);
      setError(err.response?.data?.message || 'Failed to load note details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoteDetails();
  }, [id, user]);

  // Handle Note Like
  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.post(`/notes/${id}/like`);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);

      if (res.data.isLiked) {
        // Trigger small like confetti
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }
    } catch (err) {
      console.error('Like toggle failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Note Bookmark
  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      const res = await toggleBookmark(note._id);
      setIsBookmarked(res);
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle PDF file download
  const handleDownload = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setDownloading(true);
      
      // Download PDF as blob from server
      const res = await api.get(`/notes/${id}/download`, {
        responseType: 'blob'
      });

      // Create download link in browser
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Increment local count
      setNote(prev => ({
        ...prev,
        downloadCount: (prev.downloadCount || 0) + 1
      }));

      // Celebrate download
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Error downloading note. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Handle Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      const res = await api.post(`/notes/${id}/comments`, { text: commentText });
      
      // Update local comment list (prepend new comment)
      setNote(prev => ({
        ...prev,
        comments: [
          {
            ...res.data,
            user: { _id: user._id, name: user.name, profileImage: user.profileImage }
          },
          ...(prev.comments || [])
        ]
      }));
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await api.delete(`/notes/${id}/comments/${commentId}`);
      // Filter out deleted comment from local state
      setNote(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Retrieving note files...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-955/20 text-red-500 rounded-full w-fit mx-auto">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Details Not Found</h2>
        <p className="text-slate-500 dark:text-slate-450">{error || 'This note document could not be loaded.'}</p>
        <Link to="/notes" className="inline-block px-5 py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold text-sm">
          Back to Explore
        </Link>
      </div>
    );
  }

  // File URL for pdf preview
  const serverBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  const pdfStaticUrl = `${serverBase}${note.fileUrl}`;

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/notes" className="text-sm font-semibold text-slate-400 hover:text-slate-655 dark:hover:text-slate-200">
          ← Back to Catalog
        </Link>
        {user && (user._id === note.author?._id || user.role === 'admin') && (
          <Link
            to={`/upload?edit=${note._id}`}
            className="text-xs font-bold text-amber-500 hover:underline border border-amber-250 dark:border-amber-900/40 px-3.5 py-1.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20"
          >
            Edit Document
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metadata & Interaction */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main details card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 rounded-2xl p-6 space-y-6 shadow-sm">
            
            <div className="space-y-3">
              <span className="px-2.5 py-1 text-xs font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-md border border-primary-100/30">
                {note.semester}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                {note.title}
              </h1>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{note.subject}</p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
              {note.description}
            </p>

            {/* Tags */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/notes?tag=${tag}`}
                    className="text-[10px] px-2.5 py-1 font-semibold bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-350 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Meta details */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Uploaded by</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{note.authorName || note.author?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Upload Date</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Downloads</span>
                <span className="font-bold">{note.downloadCount || 0}</span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={actionLoading}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                  isLiked
                    ? 'bg-primary-50 border-primary-200 text-primary-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                disabled={actionLoading}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-200 text-amber-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="col-span-2 py-3 bg-gradient-to-r from-primary-550 to-indigo-650 text-white font-bold rounded-xl hover:opacity-95 shadow-md shadow-primary-500/10 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <Download className="h-4.5 w-4.5" />
                <span>{downloading ? 'Downloading PDF...' : 'Download Note (PDF)'}</span>
              </button>

            </div>

          </div>

        </div>

        {/* Right Column: PDF Preview & Comments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PDF Preview Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[500px] sm:h-[600px]">
            
            <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 border-b border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-300">
              <span className="flex items-center space-x-1.5">
                <FileText className="h-4.5 w-4.5 text-red-500" />
                <span>PDF Document Preview</span>
              </span>
              <a
                href={pdfStaticUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-550 hover:underline flex items-center space-x-1"
              >
                <span>Full screen</span>
                <Eye className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Embedded Iframe PDF viewer */}
            <div className="flex-grow bg-slate-100 dark:bg-slate-950 relative">
              <iframe
                src={`${pdfStaticUrl}#toolbar=0`}
                className="w-full h-full border-none"
                title={note.title}
              ></iframe>
            </div>

          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 rounded-2xl p-6 space-y-6 shadow-sm">
            
            <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-3">
              Discussion Board ({note.comments?.length || 0})
            </h3>

            {/* Post comment form */}
            {user ? (
              <form onSubmit={handleAddComment} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center font-bold text-xs text-primary-550 shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 text-sm"
                    placeholder="Ask a question or leave a note..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-primary-500 text-white rounded-lg hover:opacity-95 disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-850/50 p-4 rounded-xl text-center text-xs font-semibold text-slate-400">
                Please{' '}
                <Link to="/login" className="text-primary-550 hover:underline font-bold">
                  Log in
                </Link>{' '}
                to participate in discussion boards.
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {note.comments && note.comments.length > 0 ? (
                note.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-3 text-sm border-b border-slate-100/50 dark:border-slate-850/40 pb-3.5 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
                      {comment.userName?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{comment.userName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-6">
                        {comment.text}
                      </p>
                    </div>

                    {/* Delete comment */}
                    {user && (user._id === comment.user?._id || user._id === comment.user || user.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-650 rounded-md transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-slate-400 py-4 font-semibold">
                  No questions or comments posted. Be the first to start the discussion!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NoteDetails;
