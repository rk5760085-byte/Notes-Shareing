import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-lg text-white">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                StudyShare
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering students worldwide by simplifying access to high-quality academic notes, textbooks, and resources. Share knowledge, learn together.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary-500 rounded-lg transition-colors duration-200">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary-500 rounded-lg transition-colors duration-200">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary-500 rounded-lg transition-colors duration-200">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-250 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/notes" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  All Study Notes
                </Link>
              </li>
              <li>
                <Link to="/notes?semester=Semester 1" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  First Year Notes
                </Link>
              </li>
              <li>
                <Link to="/notes?sort=downloads" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  Most Downloaded
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  Upload Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-250 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  About Project
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/about#faq" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  Frequently Asked
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-250 uppercase tracking-wider mb-4">
              Legal Info
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                  DMCA Take Downs
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200/50 dark:border-slate-900/55 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 text-center sm:text-left">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {currentYear} StudyShare Inc. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-1">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>using the MERN Stack.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
