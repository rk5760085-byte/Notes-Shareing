import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldCheck, CheckCircle, Phone } from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.276 3.508 8.48-.017 6.66-5.356 12-11.967 12-2.005-.001-3.973-.504-5.73-1.47L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.428 2.016 13.99 1.002 11.35 1.002 5.908 1.002 1.482 5.37 1.478 10.8c-.001 1.765.483 3.488 1.4 5.013l-.988 3.606 3.757-.965zm11.233-6.626c-.3-.15-1.77-.875-2.046-.976-.276-.101-.476-.15-.676.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.301-.15-1.267-.467-2.413-1.49-1.89-1.687-2.613-2.613-2.885-3.002-.272-.388-.031-.6.12-.748.137-.132.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.625-.925-2.225-.244-.582-.515-.509-.706-.519-.181-.01-.39-.01-.599-.01-.21 0-.55.08-.838.4-.288.32-1.1.976-1.1 2.38 0 1.405 1.025 2.76 1.163 2.95.137.19 2.017 3.08 4.887 4.319.682.295 1.214.471 1.629.603.689.219 1.317.188 1.812.114.552-.083 1.77-.723 2.02-1.388.25-.664.25-1.233.175-1.35-.075-.117-.275-.167-.575-.317z"/>
  </svg>
);

const Contact = () => {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // UX states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Format the WhatsApp message beautifully with markdown
    const whatsappMessage = `*StudyShare Support Request*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Subject:* ${subject}\n\n` +
      `*Message:*\n${message}`;

    // Construct the WhatsApp URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/919693297575?text=${encodedMessage}`;

    // Show loading state and redirect
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset form fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      // Open WhatsApp in a new tab/window
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Intro header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Contact Support</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          Have questions regarding note uploads, DMCA take-downs, copyright policies, or system issues? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Support channels card */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3">
              Direct Channels
            </h3>
            
            <div className="flex items-start space-x-3.5 text-xs text-slate-505 dark:text-slate-400">
              <div className="p-2.5 bg-primary-100 dark:bg-primary-950/30 text-primary-550 dark:text-primary-400 rounded-xl mt-0.5 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="font-bold text-slate-700 dark:text-slate-250">Email Support</p>
                <a href="mailto:rk5760085@gmail.com" className="font-semibold text-primary-500 hover:underline">rk5760085@gmail.com</a>
                <p className="text-[10px] text-slate-400 mt-1">Average response time: 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 text-xs text-slate-505 dark:text-slate-400">
              <div className="p-2.5 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-450 rounded-xl mt-0.5 shrink-0">
                <WhatsAppIcon className="h-5 w-5" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="font-bold text-slate-700 dark:text-slate-250">WhatsApp Support</p>
                <a href="https://wa.me/919693297575" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 dark:text-green-400 hover:underline">+91 9693297575</a>
                <p className="text-[10px] text-slate-400 mt-1">Tap to chat instantly</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 text-xs text-slate-505 dark:text-slate-400">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 rounded-xl mt-0.5 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="font-bold text-slate-700 dark:text-slate-250">Phone Support</p>
                <a href="tel:+919693297575" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">+91 9693297575</a>
                <p className="text-[10px] text-slate-400 mt-1">Available for urgent queries</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 text-xs text-slate-505 dark:text-slate-400">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-550 dark:text-indigo-400 rounded-xl mt-0.5 shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="text-left space-y-0.5">
                <p className="font-bold text-slate-700 dark:text-slate-250">DMCA Copyright Claims</p>
                <a href="mailto:rk5760085@gmail.com" className="font-semibold text-primary-500 hover:underline">rk5760085@gmail.com</a>
                <p className="text-[10px] text-slate-450 mt-1">Please include original URLs and copyright proof.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 rounded-xl flex items-center space-x-3 text-sm font-bold text-emerald-600 dark:text-emerald-450">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>Your message has been sent successfully! Our support desk will reach out soon.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 text-sm"
                  placeholder="Alex Carter"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 text-sm"
                  placeholder="alex@university.edu"
                  required
                />
              </div>

            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 text-sm"
                placeholder="Inquiry about note copyrights"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Description</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary-500 text-sm"
                placeholder="Details of your request..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-primary-550 to-indigo-650 text-white font-bold text-sm rounded-xl hover:opacity-95 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Sending Inquiry...' : 'Send Message'}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Contact;
