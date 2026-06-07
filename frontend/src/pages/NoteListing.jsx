import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import SkeletonCard from '../components/SkeletonCard';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  BookOpen, 
  LayoutGrid, 
  ChevronDown
} from 'lucide-react';

const NoteListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter local states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [semester, setSemester] = useState(searchParams.get('semester') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [tag, setTag] = useState(searchParams.get('tag') || '');
  const [author, setAuthor] = useState(searchParams.get('author') || '');

  // UI state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const semestersList = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
    'Other'
  ];

  const sortOptions = [
    { label: 'Latest Uploads', value: 'latest' },
    { label: 'Most Downloaded', value: 'downloads' },
    { label: 'Most Liked', value: 'likes' },
    { label: 'Oldest', value: 'oldest' },
  ];

  // Sync state from query parameters on load
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSemester(searchParams.get('semester') || '');
    setSubject(searchParams.get('subject') || '');
    setSort(searchParams.get('sort') || 'latest');
    setTag(searchParams.get('tag') || '');
    setAuthor(searchParams.get('author') || '');
  }, [searchParams]);

  // Fetch notes based on current states
  const fetchNotes = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = {};
      if (search) params.search = search;
      if (semester) params.semester = semester;
      if (subject) params.subject = subject;
      if (sort) params.sort = sort;
      if (tag) params.tag = tag;
      if (author) params.author = author;

      const res = await api.get('/notes', { params });
      setNotes(res.data);
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchParams]);

  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (semester) params.semester = semester;
    if (subject) params.subject = subject;
    if (sort) params.sort = sort;
    if (tag) params.tag = tag;
    if (author) params.author = author;

    setSearchParams(params);
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setSearch('');
    setSemester('');
    setSubject('');
    setSort('latest');
    setTag('');
    setAuthor('');
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">Explore Notes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse through peer summaries, course guides, and exam reviews.
          </p>
        </div>
        
        {/* Toggle filters on mobile */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="md:hidden flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-sm border border-slate-200/30 dark:border-slate-800/40"
        >
          <SlidersHorizontal className="h-4.5 w-4.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 rounded-2xl p-5 h-fit space-y-6 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Filters</h3>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Subject search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 transition-all"
              placeholder="e.g. Physics"
            />
          </div>

          {/* Semester selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 transition-all"
            >
              <option value="">All Semesters</option>
              {semestersList.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tag</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 transition-all"
              placeholder="e.g. algebra"
            />
          </div>

          {/* Author */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 transition-all"
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Sort selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="w-full py-2.5 bg-gradient-to-r from-primary-550 to-indigo-650 text-white font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary-500/10 transition-all duration-200"
          >
            Apply Filters
          </button>

        </aside>

        {/* Mobile Filters Drawer Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-950/40 backdrop-blur-sm flex justify-end">
            <div className="w-80 bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between shadow-2xl animate-slide-left">
              <div className="space-y-6 overflow-y-auto pr-1">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Filter Notes</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-slate-600">Close</button>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500"
                    placeholder="e.g. Calculus"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500"
                  >
                    <option value="">All Semesters</option>
                    {semestersList.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tag</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500"
                    placeholder="e.g. vectors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={applyFilters}
                  className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full py-3 border border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-350 font-bold rounded-xl"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid and Search bar */}
        <main className="md:col-span-3 space-y-6">
          
          {/* Main Search Input Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full pl-11 pr-32 py-3.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all font-medium"
              placeholder="Search by note title, subject, course code, or tags..."
            />
            <button
              onClick={applyFilters}
              className="absolute right-2 top-2 bottom-2 px-5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all duration-200"
            >
              Search
            </button>
          </div>

          {/* Selected filters tags */}
          {(semester || subject || tag || author) && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Active filters:</span>
              {subject && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-850 rounded-full flex items-center space-x-1.5">
                  <span>Subject: {subject}</span>
                  <button onClick={() => { setSubject(''); setSearchParams({ search, semester, tag, author, sort }); }} className="text-slate-400 hover:text-slate-600 font-black">×</button>
                </span>
              )}
              {semester && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-850 rounded-full flex items-center space-x-1.5">
                  <span>{semester}</span>
                  <button onClick={() => { setSemester(''); setSearchParams({ search, subject, tag, author, sort }); }} className="text-slate-400 hover:text-slate-600 font-black">×</button>
                </span>
              )}
              {tag && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-850 rounded-full flex items-center space-x-1.5">
                  <span>Tag: {tag}</span>
                  <button onClick={() => { setTag(''); setSearchParams({ search, subject, semester, author, sort }); }} className="text-slate-400 hover:text-slate-600 font-black">×</button>
                </span>
              )}
              {author && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-850 rounded-full flex items-center space-x-1.5">
                  <span>Author: {author}</span>
                  <button onClick={() => { setAuthor(''); setSearchParams({ search, subject, semester, tag, sort }); }} className="text-slate-400 hover:text-slate-600 font-black">×</button>
                </span>
              )}
              <button onClick={resetFilters} className="text-primary-500 hover:underline ml-2">Clear all</button>
            </div>
          )}

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 bg-white/40 dark:bg-slate-900/10">
                <div className="p-4 bg-slate-100 dark:bg-slate-850 text-slate-450 rounded-full w-fit mx-auto">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200">No notes found</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any documents matching your current criteria. Try adjusting your search query or filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-xl mt-4"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </main>

      </div>

    </div>
  );
};

export default NoteListing;
