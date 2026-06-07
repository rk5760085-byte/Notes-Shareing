import React from 'react';
import { BookOpen, Users, Compass, Award } from 'lucide-react';

const About = () => {
  const coreValues = [
    {
      title: 'Peer-to-Peer Learning',
      description: 'We believe students learn best when sharing knowledge. Access summaries and guides written specifically for your classes.',
      icon: Users,
    },
    {
      title: 'Open Education Access',
      description: 'Study materials should be accessible to all. We provide a completely free note sharing and downloading interface.',
      icon: BookOpen,
    },
    {
      title: 'Syllabus Alignment',
      description: 'Filter notes by specific semesters to locate resources mapped directly to your course syllabus outlines.',
      icon: Compass,
    },
    {
      title: 'Academic Support',
      description: 'Collaborate through discussion comments and bookmark directories, raising grades and exam prep efficiency.',
      icon: Award,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      
      {/* Intro section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
          Empowering Academics Through{' '}
          <span className="bg-gradient-to-r from-primary-550 to-indigo-650 bg-clip-text text-transparent">
            Collaboration
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          StudyShare is a student-centric, open-source Notes Sharing Platform built using the MERN stack. Our goal is to connect college and university students, making it effortless to share lecture summaries, exam reviews, and textbook notes.
        </p>
      </section>

      {/* Grid Values Section */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Our Core Principles</h2>
          <p className="text-sm text-slate-500 dark:text-slate-450">The values driving the StudyShare community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl flex flex-col space-y-4 shadow-sm"
            >
              <div className="p-3 bg-primary-100 dark:bg-primary-950/50 text-primary-650 dark:text-primary-400 rounded-xl w-fit">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-150">
                {value.title}
              </h3>
              <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story / Tech details */}
      <section className="bg-slate-100 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-850 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Engineered for Academic Speed
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Designed as a high-fidelity MERN project, StudyShare integrates modern file storage middlewares (Multer), encrypted user authorization tokens (JWT), and reactive frontend layouts (Tailwind CSS, React Router).
          </p>
          <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
            Students can search notes instantaneously, download PDFs with single-click actions, write questions on document discussion boards, and manage uploads in their personalized workspaces.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-inner flex flex-col justify-center space-y-3 font-mono text-xs text-slate-600 dark:text-slate-400">
          <p className="font-bold border-b border-slate-100 dark:border-slate-850 pb-2 text-primary-500">PROJECT STACK SPECS</p>
          <p><span className="font-bold text-slate-700 dark:text-slate-205">Frontend:</span> React 19, Vite, Tailwind CSS v3</p>
          <p><span className="font-bold text-slate-700 dark:text-slate-205">Backend:</span> Express.js, Node.js, Mongoose</p>
          <p><span className="font-bold text-slate-700 dark:text-slate-205">Database:</span> MongoDB Atlas Cluster</p>
          <p><span className="font-bold text-slate-700 dark:text-slate-205">Security:</span> Bcrypt hashing, JWT Route Guards</p>
        </div>
      </section>

    </div>
  );
};

export default About;
