import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import SkeletonCard from '../components/SkeletonCard';
import { Bookmark, BookOpen } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      setBookmarks(res.data.bookmarks || []);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkUpdate = (noteId, isBookmarked) => {
    if (!isBookmarked) {
      // If unbookmarked, remove from view
      setBookmarks((prev) => prev.filter((note) => note._id !== noteId && note !== noteId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center space-x-2.5">
          <Bookmark className="h-7 w-7 text-amber-500 fill-amber-500/20" />
          <span>My Saved Bookmarks</span>
        </h1>
        <p className="text-sm text-slate-505 dark:text-slate-400 mt-1.5">
          Quickly access study summaries and lecture logs you've bookmarked.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {bookmarks.map((note) => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onBookmarkUpdate={handleBookmarkUpdate} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl py-20 px-4 space-y-4 bg-white/50 dark:bg-slate-900/10">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full w-fit mx-auto">
            <Bookmark className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-700 dark:text-slate-200">Your bookmark folder is empty</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Save bookmarks on the Explore page to easily find files for quick reference.
            </p>
          </div>
          <Link
            to="/notes"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all"
          >
            <BookOpen className="h-4.5 w-4.5" />
            <span>Browse Study Notes</span>
          </Link>
        </div>
      )}

    </div>
  );
};

export default Bookmarks;
