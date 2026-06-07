import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        
        {/* Visual Graphic */}
        <div className="relative mx-auto w-24 h-24 bg-red-50 dark:bg-red-955/20 text-red-500 rounded-full flex items-center justify-center border border-red-100 dark:border-red-900/20 shadow-inner">
          <AlertCircle className="h-12 w-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100">404</h1>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Page Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The study page or document you are trying to view does not exist or has been removed by content moderation.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-550 to-indigo-650 text-white font-bold text-sm rounded-xl hover:opacity-95 shadow-md shadow-primary-500/10 transition-all duration-200"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Return to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
