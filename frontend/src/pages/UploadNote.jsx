import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

const UploadNote = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit'); // Check if edit mode is active

  const fileInputRef = useRef(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('Semester 1');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  
  // UX states
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Semesters list
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

  // Load note data if in edit mode
  useEffect(() => {
    const fetchNoteToEdit = async () => {
      if (!editId) return;

      try {
        setPageLoading(true);
        const res = await api.get(`/notes/${editId}`);
        const note = res.data;

        // Populate fields
        setTitle(note.title);
        setSubject(note.subject);
        setSemester(note.semester);
        setDescription(note.description);
        setTags(note.tags.join(', '));
      } catch (err) {
        console.error('Error fetching note for edit:', err);
        setError('Failed to retrieve note details for editing.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchNoteToEdit();
  }, [editId]);

  // File drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF documents are allowed.');
      setPdfFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File is too large. Maximum size is 10MB.');
      setPdfFile(null);
      return;
    }

    setError(null);
    setPdfFile(file);
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !subject || !semester || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    // PDF is required only when uploading a new note
    if (!editId && !pdfFile) {
      setError('Please upload a PDF document.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('semester', semester);
      formData.append('description', description);
      formData.append('tags', tags);
      
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      if (editId) {
        // Edit flow (PUT)
        await api.put(`/notes/${editId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Upload flow (POST)
        await api.post('/notes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccess(true);
      
      // Trigger celebration effect
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-slate-505 dark:text-slate-400 font-medium">Loading form details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Back to dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-205 transition-colors"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {editId ? 'Edit Study Note' : 'Upload Study Note'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            {editId 
              ? 'Update the title, subject, tags or upload a revised PDF file.' 
              : 'Share your academic summaries to help your peers excel.'}
          </p>
        </div>

        {/* Success / Error Banners */}
        {success && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 rounded-xl flex items-center space-x-3 text-sm font-bold text-emerald-600 dark:text-emerald-450">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>Note {editId ? 'updated' : 'uploaded'} successfully! Redirecting to dashboard...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start space-x-3 text-xs font-semibold text-red-650 dark:text-red-400 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Note Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Data Structures Lecture Notes"
                required
              />
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Subject / Course <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Computer Science CSE-201"
                required
              />
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Semester / Class <span className="text-red-500">*</span>
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              >
                {semestersList.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="recursion, tree, exam-guide"
              />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Note Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Provide a detailed summary of what this note covers (e.g. key subtopics, lecture numbers, reference textbook)..."
              required
            ></textarea>
          </div>

          {/* PDF Drag & Drop Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {editId ? 'Revised PDF File (Optional)' : 'PDF File Upload *'}
            </label>
            
            {!pdfFile ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary-550 bg-primary-50/20 dark:bg-primary-950/10' 
                    : 'border-slate-250 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 shadow-sm border border-slate-200/40 dark:border-slate-800/60 mb-3 group-hover:scale-105 transition-transform duration-200">
                  <UploadCloud className="h-6 w-6 text-primary-550" />
                </div>
                <p className="text-sm font-bold text-slate-755 dark:text-slate-200">
                  Drag & drop your PDF file here, or <span className="text-primary-550 hover:underline">browse</span>
                </p>
                <p className="text-xs text-slate-405 mt-1">
                  Only PDF files up to 10MB are allowed
                </p>
              </div>
            ) : (
              /* Selected File Pane */
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-100 dark:border-red-900/20 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-4">
                      {pdfFile.name}
                    </p>
                    <p className="text-xs text-slate-400 font-semibold">
                      {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary-550 to-indigo-650 text-white font-bold rounded-xl hover:opacity-95 disabled:opacity-50 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-200 text-center"
          >
            {loading 
              ? (editId ? 'Saving Changes...' : 'Uploading Study Note...') 
              : (editId ? 'Save Changes' : 'Upload Note')}
          </button>

        </form>

      </div>
    </div>
  );
};

export default UploadNote;
