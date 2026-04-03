import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Zap, Bell, ArrowRight, CheckCircle, Shield, Clock, ChevronDown, Sparkles, Users, Award } from 'lucide-react';
import ComplaintForm from '../components/ComplaintForm';
import AnimatedButton from '../components/AnimatedButton';
import './Home.css';

const _Motion = motion;

const steps = [
  {
    icon: FileText,
    title: 'Describe the Issue',
    description: 'Provide clear, detailed information about the problem and its exact location.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Zap,
    title: 'Set Priority Level',
    description: 'Select the appropriate severity to help authorities prioritize urgent issues.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Bell,
    title: 'Get Notified',
    description: 'Receive email updates when your reported issue is being addressed or resolved.',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

const stats = [
  { value: '10K+', label: 'Issues Resolved', icon: CheckCircle, color: 'emerald' },
  { value: '24/7', label: 'Always Available', icon: Clock, color: 'blue' },
  { value: '99%', label: 'Resolution Rate', icon: Shield, color: 'purple' },
];

const features = [
  { icon: Users, title: 'Community Driven' },
  { icon: Award, title: 'Trusted Platform' },
  { icon: Sparkles, title: 'Easy to Use' },
];

export default function Home() {
  const scrollToForm = () => {
    document.getElementById('report-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[calc(100vh+200px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-float" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative w-full page-container min-h-[calc(100vh+200px)] flex items-center justify-center py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto flex flex-col items-center gap-8 lg:gap-10"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-white/90 text-center">Trusted by 10,000+ citizens worldwide</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] text-center" 
            >
              <span
                className="inline-block bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #3B82F6, #22C55E)' }}
              >
                Report Issues
              </span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Build Communities
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-white max-w-2xl mx-auto leading-relaxed text-center" style={{ color: 'white' }}
            >
              Help improve your community by reporting public issues. Your voice matters in creating safer, cleaner neighborhoods for everyone.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <AnimatedButton onClick={scrollToForm} variant="white">
                Report an Issue
              </AnimatedButton>
              <Link to="/track-status">
                <AnimatedButton variant="secondary">
                  Track Complaint
                </AnimatedButton>
              </Link>
            </motion.div>

            {/* Mini Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8"
            >
              {features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-3 text-white/60 text-center">
                  <feature.icon size={18} className="text-blue-400" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-start justify-center gap-6 sm:gap-8 max-w-md w-full mx-auto text-center"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="w-[92px] text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/10 flex items-center justify-center">
                    <stat.icon size={24} className="text-emerald-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-blue-200/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.button
              onClick={scrollToForm}
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-3 rounded-full text-white/40 hover:text-white/60 transition-colors bg-white/5 backdrop-blur-sm border border-white/10"
              aria-label="Scroll down"
            >
              <ChevronDown size={24} />
            </motion.button>
          </motion.div>
        </div>

        {/* Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="section bg-gradient-to-b from-slate-50 to-white">
        <div className="page-container">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="relative left-1/2 -translate-x-[38%] text-center w-full max-w-2xl mb-28"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              <Sparkles size={16} />
              How It Works
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Three Simple Steps
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Reporting and tracking public issues has never been easier. Follow these steps to make a difference in your community.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="mt-20 max-w-6xl mx-auto md:translate-x-44 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20 place-items-center">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative w-full max-w-sm"
              >
                <div className="how-it-works-card">
                  {/* Step Number */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl bg-slate-900 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <step.icon size={28} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="how-it-works-card-title">{step.title}</h3>
                  <p className="how-it-works-card-text">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FORM SECTION ===== */}
      <section id="report-form" className="section home-report-section relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        </div>
        <div className="relative page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="home-report-intro"
          >
            <span className="home-report-chip">
              <FileText size={16} />
              Get Started
            </span>
            <h2 className="home-report-title">
              Submit Your Report
            </h2>
            <p className="home-report-subtitle">
              Fill out the form below and we'll notify the relevant authorities. You'll receive email updates on the progress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="home-report-form-wrap"
          >
            <ComplaintForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
