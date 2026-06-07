import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm p-5 flex flex-col h-full space-y-4 animate-pulse-fast">
      
      {/* Semester Tag & Bookmark placeholder */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="h-8 w-8 bg-slate-205 dark:bg-slate-800 rounded-lg"></div>
      </div>

      {/* Title placeholder */}
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
      </div>

      {/* Description lines */}
      <div className="space-y-1.5 py-1">
        <div className="h-3 w-full bg-slate-105 dark:bg-slate-800/40 rounded"></div>
        <div className="h-3 w-5/6 bg-slate-105 dark:bg-slate-800/40 rounded"></div>
      </div>

      {/* Tags placeholder */}
      <div className="flex space-x-2 pt-2">
        <div className="h-4.5 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4.5 w-14 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4.5 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>

      {/* Footer spacer */}
      <div className="flex-grow"></div>

      {/* Footer bar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="h-3 w-16 bg-slate-205 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-3.5 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-3.5 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>

    </div>
  );
};

export default SkeletonCard;
