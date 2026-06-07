import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import SkeletonCard from '../components/SkeletonCard';
import { 
  ArrowRight, 
  UploadCloud, 
  Search, 
  Download, 
  Users, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Star,
  Plus,
  Minus
} from 'lucide-react';

const Home = () => {
  const [popularNotes, setPopularNotes] = useState([]);
  const [latestNotes, setLatestNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Get popular notes (sorted by download count)
        const popularRes = await api.get('/notes?sort=downloads');
        setPopularNotes(popularRes.data.slice(0, 4));

        // Get latest notes (sorted by latest date)
        const latestRes = await api.get('/notes?sort=latest');
        setLatestNotes(latestRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching landing notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const stats = [
    { label: 'Total Downloads', value: '25,000+', icon: Download },
    { label: 'Active Students', value: '10,050+', icon: Users },
    { label: 'Study Documents', value: '8,400+', icon: BookOpen },
  ];

  const features = [
    {
      title: 'Easy File Sharing',
      description: 'Upload your notes in PDF format with tags, subjects, and semesters. Helping classmates has never been simpler.',
      icon: UploadCloud,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Advanced Query Search',
      description: 'Find files instantly by subject, title, tags, or semester. Filter through semesters for specific curriculum materials.',
      icon: Search,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'High-speed Downloads',
      description: 'Download notes directly with one-click access for offline study. Keep files organized in your local devices.',
      icon: Download,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Moderated Content',
      description: 'Admin verification and moderation ensure only appropriate, high-quality, and helpful documents are accessible.',
      icon: ShieldCheck,
      color: 'from-rose-500 to-orange-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Computer Science Sophomore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      comment: 'StudyShare has completely changed how I prepare for midterms. Being able to access high-quality senior notes saves me hours of research!',
      stars: 5,
    },
    {
      name: 'Marcus Chen',
      role: 'Electrical Engineering Senior',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      comment: 'Uploading my lab sheets and study guides feels so rewarding. The feedback and likes from other students motivate me to keep compiling nice notes.',
      stars: 5,
    },
    {
      name: 'Alisha Patel',
      role: 'Business Administration Junior',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      comment: 'The semester-wise filtering is incredible. I can find specific marketing and finance summaries that align perfectly with my university syllabus.',
      stars: 4,
    }
  ];

  const faqs = [
    {
      question: 'What file format does StudyShare support?',
      answer: 'Currently, we support PDF document uploads. This ensures files maintain their styling, layouts, and font structure across all mobile, tablet, and desktop devices.'
    },
    {
      question: 'Is it free to download notes?',
      answer: 'Yes! StudyShare is a community platform built by students for students. All note uploads and downloads are 100% free of charge.'
    },
    {
      question: 'Can I delete or edit a note after uploading?',
      answer: 'Absolutely. You can edit the description, tags, semester, or title, and delete any of your uploaded notes directly from your Student Dashboard.'
    },
    {
      question: 'How does content moderation work?',
      answer: 'Our admin panels monitor note uploads. If any document is found to contain inappropriate content, copyrighted textbooks without permission, or spam, it will be immediately removed.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-primary-400/20 dark:bg-primary-900/10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-400/25 dark:bg-indigo-900/10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-650 dark:text-primary-400 text-xs font-bold border border-primary-100 dark:border-primary-900/30">
            <Award className="h-4 w-4" />
            <span>Top Rated Student Collaboration Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 max-w-4xl mx-auto leading-[1.15]">
            Share Your Knowledge,{' '}
            <span className="bg-gradient-to-r from-primary-550 to-indigo-650 dark:from-primary-450 dark:to-indigo-400 bg-clip-text text-transparent">
              Elevate Your Grades
            </span>
          </h1>

          <p className="text-lg text-slate-505 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Access, download, and share comprehensive lecture summaries, study guides, and past exams. Created by fellow university students to boost academic success.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/notes"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary-550 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary-500/25 hover:opacity-95 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Explore Notes</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/upload"
              className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <UploadCloud className="h-5 w-5 text-slate-450" />
              <span>Upload Mine</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-3 bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-xl">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stat.value}</p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-slate-850 dark:text-slate-100">Why Use StudyShare?</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            A fully featured ecosystem tailormade to help students collaborate efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col space-y-4 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-tr ${feature.color} text-white w-fit shadow-md`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150 group-hover:text-primary-500 transition-colors duration-250">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Notes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Popular Notes</h2>
            <p className="text-sm text-slate-550 dark:text-slate-450">Most downloaded documents on the platform.</p>
          </div>
          <Link to="/notes?sort=downloads" className="text-sm font-semibold text-primary-550 dark:text-primary-400 hover:underline flex items-center space-x-1 shrink-0">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : popularNotes.length > 0 ? (
            popularNotes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl text-slate-400">
              No notes uploaded yet. Be the first to share one!
            </div>
          )}
        </div>
      </section>

      {/* Latest Notes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-850 dark:text-slate-100">Recently Added</h2>
            <p className="text-sm text-slate-500 dark:text-slate-450">Fresh notes uploaded by the community.</p>
          </div>
          <Link to="/notes?sort=latest" className="text-sm font-semibold text-primary-550 dark:text-primary-400 hover:underline flex items-center space-x-1 shrink-0">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : latestNotes.length > 0 ? (
            latestNotes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
              No notes uploaded yet.
            </div>
          )}
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Testimonials</h2>
          <p className="text-sm text-slate-550 dark:text-slate-450">See how StudyShare is helping college students succeed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="space-y-4">
                <div className="flex space-x-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4.5 w-4.5 ${
                        i < t.stars 
                          ? 'text-amber-500 fill-amber-500' 
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover shadow-inner"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.name}</h4>
                  <p className="text-[11px] font-semibold text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-850 dark:text-slate-100">Got Questions?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/80 rounded-xl overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors duration-205"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 text-primary-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100/30 dark:border-slate-800/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-indigo-700 text-white p-8 md:p-14 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 md:max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight">Ready to boost your studies?</h2>
            <p className="text-sm text-primary-100 leading-relaxed">
              Sign up today to download hundreds of peer-reviewed summaries, save bookmarks, leave comments, and contribute your notes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-primary-700 hover:bg-primary-50 font-bold rounded-xl text-center shadow-lg transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/notes"
              className="px-6 py-3 bg-primary-700/40 hover:bg-primary-700/60 border border-primary-400 text-white font-bold rounded-xl text-center transition-all duration-200"
            >
              Browse Notes
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
