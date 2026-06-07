import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Download, 
  ThumbsUp, 
  User, 
  Bookmark, 
  FileText,
  Calendar,
  Eye
} from 'lucide-react';

const NoteCard = ({ note, onBookmarkUpdate }) => {
  const { user, toggleBookmark } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    if (user) {
      setIsBookmarked(user.bookmarks.some((b) => (b._id || b) === note._id));
    } else {
      setIsBookmarked(false);
    }
  }, [user, note._id]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookmarking(true);
      const res = await toggleBookmark(note._id);
      setIsBookmarked(res);
      if (onBookmarkUpdate) {
        onBookmarkUpdate(note._id, res);
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      setBookmarking(false);
    }
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden hover-card-accent flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Header Info */}
      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-3.5">
          <span className="px-2.5 py-1 text-xs font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-md border border-primary-100/30 dark:border-primary-900/20">
            {note.semester}
          </span>
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarking}
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 text-amber-500'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-650 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark note'}
          >
            <Bookmark className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Note Title */}
        <Link to={`/notes/${note._id}`} className="block">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150 group-hover:text-primary-500 transition-colors duration-200 line-clamp-1">
            {note.title}
          </h3>
        </Link>

        {/* Subject */}
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-450 mt-1">
          {note.subject}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3.5 line-clamp-2 leading-relaxed">
          {note.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-650 dark:text-slate-350 rounded"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 rounded">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        
        {/* Author */}
        <div className="flex items-center space-x-1.5 truncate max-w-[120px]">
          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="font-medium truncate" title={note.authorName}>
            {note.authorName}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-3 shrink-0 font-medium">
          <span className="flex items-center space-x-1" title="Downloads">
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>{note.downloadCount}</span>
          </span>
          <span className="flex items-center space-x-1" title="Likes">
            <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
            <span>{note.likes?.length || 0}</span>
          </span>
        </div>

      </div>

      {/* Hover Action Overlay Overlay Button */}
      <div className="absolute inset-x-0 bottom-0 top-auto translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-semibold py-3 flex items-center justify-center space-x-2 text-sm shadow-inner cursor-pointer"
           onClick={() => navigate(`/notes/${note._id}`)}>
        <Eye className="h-4 w-4" />
        <span>View Details</span>
      </div>

    </div>
  );
};

export default NoteCard;
