/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Terminal as TerminalIcon, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Server, 
  BrainCircuit, 
  Cpu, 
  Phone, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Copy, 
  Calendar, 
  Inbox,
  Terminal,
  XCircle,
  FileText
} from 'lucide-react';

// --- Types ---
interface Project {
  id: string;
  title: string;
  description: string;
  detail: string;
  category: 'frontend' | 'backend' | 'ai' | 'fullstack';
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  stats: string;
  imageColor: string; // Tailwind gradient definitions
}

interface Skill {
  name: string;
  level: number; // percentage
  category: 'frontend' | 'backend' | 'tools' | 'ai';
  icon: React.ReactNode;
}

interface ExperienceTimeline {
  period: string;
  role: string;
  company: string;
  description: string;
  type: 'work' | 'education';
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export default function App() {
  // --- States ---
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeProjectFilter, setActiveProjectFilter] = useState<'all' | 'frontend' | 'backend' | 'ai' | 'fullstack'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Terminal Sandbox States
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
    { type: 'output', text: '⚡ Welcome to Chohan.OS terminal setup.' },
    { type: 'output', text: 'Type "help" to view list of commands, or click helper buttons below.' }
  ]);
  
  // Contact Form States & local message inbox storage
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessageText, setContactMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subMessage, setSubMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [storedMessages, setStoredMessages] = useState<ContactMessage[]>([]);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Load local message logs on mount to simulate real database feedback loop
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_messages');
    if (saved) {
      try {
        setStoredMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Set active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'terminal', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Static Portfolio Data ---
  const projects: Project[] = [
    {
      id: 'p1',
      title: 'NeuroSynth AI Code Companion',
      description: 'An AI-powered co-pilot that scans workspace patterns to suggest context-aware architectural frameworks using real-time LLMs.',
      detail: 'This tool connects multi-file modules using neural relationship mappings, optimizing vector retrieval by up to 40%. Includes a fully customized, responsive web code viewer with terminal playback capabilities.',
      category: 'ai',
      tags: ['React', 'Node.js', 'Vite', 'Gemini Web SDK', 'Tailwind CSS'],
      githubUrl: 'https://github.com/example/neurosynth-ai',
      liveUrl: '#',
      stats: '4.8k Stars • 15k Installs',
      imageColor: 'from-blue-600 to-indigo-800'
    },
    {
      id: 'p2',
      title: 'Aether Distributed Cache',
      description: 'High-performance, transactional local cache engine with reactive WebSocket sync pipelines and eventual consistency guarantees.',
      detail: 'Designed to solve high-frequency trading latency gaps. Built custom event-loop adapters ensuring consistent 1.2ms data deliveries under loads of 150k operations per second.',
      category: 'backend',
      tags: ['TypeScript', 'Rust', 'Redis REST API', 'Docker', 'WebSockets'],
      githubUrl: 'https://github.com/example/aether-cache',
      liveUrl: '#',
      stats: '99.99% Uptime • Direct Clustering',
      imageColor: 'from-violet-600 to-fuchsia-800'
    },
    {
      id: 'p3',
      title: 'Lumina Cloud Analytics',
      description: 'Sleek visual dashboard visualizing cloud ingress/egress metrics, server container consumption levels, and automated system reports.',
      detail: 'A responsive layout engineered utilizing D3.js and Recharts, offering smooth real-time charts, SVG rendering pipelines, dark-theme adaptive coloring, and immediate CSV exports.',
      category: 'frontend',
      tags: ['React 19', 'Tailwind v4', 'D3.js', 'Recharts', 'Vite Bundle'],
      githubUrl: 'https://github.com/example/lumina-charts',
      liveUrl: '#',
      stats: 'Aesthetic Light/Dark Sync',
      imageColor: 'from-cyan-500 to-blue-700'
    },
    {
      id: 'p4',
      title: 'Synthetica Audio Workstation',
      description: 'A completely in-browser digital audio editing experience with synthesizer capabilities and real-time canvas visualization overlays.',
      detail: 'Utilizes Web Audio API to create functional oscillators, high-pass/low-pass filters, gain controls, and timeline nodes. Tracks canvas animation updates dynamically to maximize performance.',
      category: 'fullstack',
      tags: ['React', 'TS', 'Web Audio Engine', 'HTML5 Canvas', 'Tailwind'],
      githubUrl: 'https://github.com/example/synthetica-synth',
      liveUrl: '#',
      stats: 'Client-Authoritative Oscillator',
      imageColor: 'from-emerald-500 to-teal-700'
    }
  ];

  const skills: Skill[] = [
    { name: 'React / Next.js', level: 95, category: 'frontend', icon: <Code2 className="w-5 h-5 text-indigo-400" /> },
    { name: 'TypeScript', level: 95, category: 'frontend', icon: <Code2 className="w-5 h-5 text-blue-400" /> },
    { name: 'Tailwind CSS v4', level: 90, category: 'frontend', icon: <Code2 className="w-5 h-5 text-cyan-400" /> },
    { name: 'Node.js / Express', level: 88, category: 'backend', icon: <Server className="w-5 h-5 text-green-400" /> },
    { name: 'GraphQL / REST APIs', level: 90, category: 'backend', icon: <Server className="w-5 h-5 text-pink-400" /> },
    { name: 'PostgreSQL / Firestore', level: 85, category: 'backend', icon: <Server className="w-5 h-5 text-purple-400" /> },
    { name: 'Gemini SDK Integration', level: 88, category: 'ai', icon: <BrainCircuit className="w-5 h-5 text-violet-400" /> },
    { name: 'LangChain & VectorDB', level: 80, category: 'ai', icon: <BrainCircuit className="w-5 h-5 text-emerald-400" /> },
    { name: 'Docker / Cloud Run', level: 82, category: 'tools', icon: <Cpu className="w-5 h-5 text-amber-500" /> },
    { name: 'Git / CI-CD Actions', level: 90, category: 'tools', icon: <Cpu className="w-5 h-5 text-gray-400" /> }
  ];

  const timeline: ExperienceTimeline[] = [
    {
      period: '2024 - Present',
      role: 'Senior Staff Full Stack Engineer',
      company: 'Apex Digital Systems',
      description: 'Principal architect overseeing clean responsive platform re-engineering. Built high-speed API routes utilizing Express proxies, integrated AI solutions, and mentored 8 framework engineers.',
      type: 'work'
    },
    {
      period: '2022 - 2024',
      role: 'Full Stack Web Developer',
      company: 'Novus Interactive Studio',
      description: 'Shipped highly interactive web interfaces styling with custom Tailwind CSS integrations. Decreased deployment cold-start latency by bundling modular JS and optimizing database schemas.',
      type: 'work'
    },
    {
      period: '2020 - 2022',
      role: 'M.S. in Computer Science',
      company: 'Global Tech Institute',
      description: 'Specialized in automated systems development, web protocols, and client-side optimization frameworks. Graduated Maxima Cum Laude.',
      type: 'education'
    },
    {
      period: '2016 - 2020',
      role: 'B.S. in Software Systems',
      company: 'Centennial Science Academy',
      description: 'Foundational learning covering computational analysis, algorithms, high-efficiency data caching, and user-centric GUI designs.',
      type: 'education'
    }
  ];

  // --- Terminal Engine Logic ---
  const handleTerminalCommand = (commandStr: string) => {
    const cleanCmd = commandStr.trim().toLowerCase();
    if (!cleanCmd) return;

    const newHistory = [...terminalHistory, { type: 'input' as const, text: cleanCmd }];

    switch (cleanCmd) {
      case 'help':
        newHistory.push(
          { type: 'output', text: '👨‍💻 Available commands:' },
          { type: 'output', text: '  - about     : Display brief developer background introduction.' },
          { type: 'output', text: '  - skills    : List primary technical and framework expertise.' },
          { type: 'output', text: '  - projects  : Show selected showcase projects summary.' },
          { type: 'output', text: '  - contact   : Print direct communication options.' },
          { type: 'output', text: '  - clear     : Flush screen command history.' },
          { type: 'output', text: '  - secret    : Trigger a funny Easter Egg terminal log!' }
        );
        break;
      case 'about':
        newHistory.push(
          { type: 'output', text: '👤 Awais Chohan - Senior Full Stack & AI Developer.' },
          { type: 'output', text: '  Deeply passionate about crafting premium client interactive visual layers' },
          { type: 'output', text: '  and configuring robust, lightning-fast servers.' },
          { type: 'output', text: '  Driven to design lightweight, scalable applications.' }
        );
        break;
      case 'skills':
        newHistory.push(
          { type: 'output', text: '🛠️ Stack Proficiency Overview:' },
          { type: 'output', text: '  - Frontend: React 19, TypeScript, Next.js, Tailwind v4, D3' },
          { type: 'output', text: '  - Backend : Node.js, Express, REST APIs, GraphQL' },
          { type: 'output', text: '  - Databases: PostgreSQL, Firestore, Redis Cache' },
          { type: 'output', text: '  - DevOps  : Docker, GitHub Actions, Server Restarts, Cloud Run' }
        );
        break;
      case 'projects':
        newHistory.push(
          { type: 'output', text: '🚀 Current Showcase Projects:' },
          { type: 'output', text: '  1. NeuroSynth AI - Context-aware interactive assistant.' },
          { type: 'output', text: '  2. Aether Cache - 1.2ms WebSocket syncing datastore.' },
          { type: 'output', text: '  3. Lumina Analytics - Real-time cloud container charts.' },
          { type: 'output', text: '  4. Synthetica Synth - HTML5 Digital Audio oscillator.' }
        );
        break;
      case 'contact':
        newHistory.push(
          { type: 'output', text: '📬 Direct Inbound Channels:' },
          { type: 'output', text: '  - Email : pubgokplayer@gmail.com' },
          { type: 'output', text: '  - GitHub: github.com/awais-chohan' },
          { type: 'output', text: '  - Desk  : Work Desk 22 - West AI Studio Wing' }
        );
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'secret':
        newHistory.push(
          { type: 'output', text: '🎉 EASTER EGG REVEALED!' },
          { type: 'output', text: '  "There are 10 types of people in the world:' },
          { type: 'output', text: '   those who understand binary, and those who don\'t."' },
          { type: 'output', text: '🤖 Keep coding, humanoid!' }
        );
        break;
      default:
        newHistory.push({
          type: 'output',
          text: `❌ Command "${cleanCmd}" unrecognized. Type "help" to view options.`
        });
        break;
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTerminalCommand(terminalInput);
  };

  // --- Contact Form Submission & Local Inbox Logging ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubMessage(null);

    // Basic Validations
    if (!contactName.trim() || !contactEmail.trim() || !contactMessageText.trim()) {
      setSubMessage({ type: 'error', text: 'All form fields are strictly required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setSubMessage({ type: 'error', text: 'Please enter a valid structure email address.' });
      return;
    }

    setIsSubmitting(true);

    // Simulate standard server latency
    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: Math.random().toString(36).substring(2, 9),
        name: contactName.trim(),
        email: contactEmail.trim(),
        message: contactMessageText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistory = [newMessage, ...storedMessages];
      setStoredMessages(updatedHistory);
      localStorage.setItem('portfolio_messages', JSON.stringify(updatedHistory));

      setIsSubmitting(false);
      setSubMessage({
        type: 'success',
        text: `Success! Message submitted securely. Awais will reply to ${contactEmail} shortly.`
      });

      // Clear input fields
      setContactName('');
      setContactEmail('');
      setContactMessageText('');
    }, 1000);
  };

  const clearInboundMessages = () => {
    localStorage.removeItem('portfolio_messages');
    setStoredMessages([]);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('pubgokplayer@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredProjects = activeProjectFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeProjectFilter);

  return (
    <div className="relative min-h-screen text-gray-100 font-sans tracking-normal select-none overflow-x-hidden bg-brand-bg">
      {/* 1. Ambient Decorative Atmospheric Glow Blobs */}
      <div className="absolute top-[8%] right-[-10%] w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[130px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-[30%] left-[-15%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-[8%] right-[-10%] w-[350px] h-[350px] rounded-full bg-cyan-700/15 blur-[120px] animate-pulse-glow pointer-events-none" />

      {/* Decorative subtle Top Header Grid Accent */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-grid-pattern opacity-40 pointer-events-none" />

      {/* 2. Top Header & Responsive Navigation */}
      <nav id="navbar" className="sticky top-0 z-40 w-full border-b border-gray-900 bg-brand-bg/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo area */}
            <a href="#hero" className="flex items-center space-x-2 group">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-brand-primary/25 group-hover:scale-105 transition-transform">
                A
              </span>
              <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
                Chohan<span className="text-brand-secondary">.dev</span>
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { id: 'hero', label: 'Intro' },
                { id: 'about', label: 'About' },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'experience', label: 'Milestones' },
                { id: 'terminal', label: 'Sandbox' },
                { id: 'contact', label: 'Contact' }
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === link.id
                      ? 'text-brand-secondary bg-gray-900/50 border border-gray-800'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/30'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Actions: Resume CTA */}
            <div className="hidden md:block">
              <a 
                href="#contact" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-secondary hover:to-brand-secondary/80 text-white rounded-lg text-xs font-semibold shadow-md shadow-brand-primary/10 hover:shadow-brand-secondary/20 hover:scale-[1.02] transform transition-all"
              >
                Hire Awais
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden">
              <button
                id="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-450 hover:bg-gray-900 focus:outline-none transition-colors border border-gray-800/80"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-dropdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-gray-900 bg-brand-bg/95 backdrop-blur-xl"
            >
              <div className="px-3 py-4 space-y-1.5">
                {[
                  { id: 'hero', label: 'Intro' },
                  { id: 'about', label: 'About' },
                  { id: 'skills', label: 'Skills' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'experience', label: 'Milestones' },
                  { id: 'terminal', label: 'OS Sandbox' },
                  { id: 'contact', label: 'Contact' }
                ].map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2 text-base font-medium rounded-lg ${
                      activeSection === link.id
                        ? 'text-brand-secondary bg-gray-900 border border-gray-800'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 px-4 pb-2">
                  <a
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white rounded-lg text-sm font-semibold hover:from-brand-secondary transition-colors"
                  >
                    Hire Awais
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Main Contents Wrap --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 3. Hero Section */}
        <section id="hero" className="py-14 md:py-24 flex flex-col items-center justify-center text-center">
          {/* Glowing Pill Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/35 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-6 scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-secondary" />
            Ready for new projects in 2026
          </motion.div>

          {/* Premium Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-none select-text">
              Engineering Digital <br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent drop-shadow-sm text-glow">
                Aesthetic Masterpieces
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-455 text-base sm:text-lg md:text-xl font-light mb-8 select-text leading-relaxed px-2">
              Hey, I am <span className="text-white font-medium">Awais Chohan</span>. A staff full stack developer specializing in responsive interfaces, reactive database pipelines, and high-quality AI web integrations.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md px-4 mb-16"
          >
            <a 
              href="#projects" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-brand-bg text-sm font-semibold shadow-lg shadow-white/5 transition-all"
            >
              Explore Solutions
              <ArrowRight className="w-4 h-4 text-brand-bg" />
            </a>
            <a 
              href="#terminal" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-card hover:bg-brand-card/80 border border-gray-800 hover:border-gray-700 text-gray-250 text-sm font-medium transition-all"
            >
              <TerminalIcon className="w-4 h-4 text-brand-secondary" />
              Try Chohan.OS
            </a>
          </motion.div>

          {/* Core Interactive Desktop Dashboard Shell Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="bg-brand-card border border-gray-850 rounded-2xl shadow-2xl shadow-cyan-950/20 overflow-hidden">
              {/* Header bar of visual shell */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-900 select-none">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/85" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-gray-400 font-mono text-xs pl-2">dev_terminal_runtime.sh</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded px-2 py-0.5 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-green-450 uppercase font-semibold">Active Pipeline</span>
                </div>
              </div>

              {/* Shell Internal Layout columns */}
              <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[340px] text-left font-mono">
                {/* Left quick terminal controller */}
                <div className="lg:col-span-2 p-4 bg-gray-950/50 border-r border-gray-900 text-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-gray-400 text-glow font-bold uppercase mb-2 tracking-wide text-[10px]">Command Console</h3>
                    <p className="text-gray-500 mb-4 leading-relaxed">
                      Interact with Awais's portfolio via simulated commands or quick clicks below.
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Display About', cmd: 'about' },
                        { label: 'List Core Skills', cmd: 'skills' },
                        { label: 'View Portfolio Projects', cmd: 'projects' },
                        { label: 'Communication Methods', cmd: 'contact' },
                        { label: 'Developer Joke', cmd: 'secret' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTerminalCommand(item.cmd)}
                          className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-gray-900 hover:bg-brand-primary/10 border border-gray-850 hover:border-brand-primary/35 text-gray-300 hover:text-brand-primary text-[11px] font-medium text-left transition-colors"
                        >
                          <span>{item.label}</span>
                          <span className="text-gray-550 group-hover:text-brand-primary text-[10px]">.{item.cmd}()</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-900 mt-4 lg:mt-0 text-[10px] text-gray-500 flex items-center justify-between">
                    <span>Host: Cloud Run Workspace</span>
                    <button 
                      onClick={() => handleTerminalCommand('clear')}
                      className="text-red-400/80 hover:text-red-400 transition-colors"
                    >
                      [Clear Screen]
                    </button>
                  </div>
                </div>

                {/* Right scrollable terminal output area */}
                <div className="lg:col-span-3 p-4 flex flex-col justify-between overflow-y-auto max-h-[380px]">
                  <div id="terminal-screen" className="space-y-3 font-mono text-[11.5px] text-gray-300 leading-relaxed max-h-[300px] overflow-y-auto pr-1">
                    {terminalHistory.map((line, idx) => (
                      <div key={idx} className="border-l-2 pl-2 border-transparent">
                        {line.type === 'input' ? (
                          <div className="text-brand-secondary flex items-start gap-1 font-semibold">
                            <span>chohan.dev:~$</span>
                            <span className="text-gray-250 font-normal">{line.text}</span>
                          </div>
                        ) : (
                          <div className="text-gray-400 whitespace-pre-wrap leading-relaxed select-text font-light">
                            {line.text}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Blink index line */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-550 select-none">chohan.dev:~$</span>
                      <span className="w-2.5 h-4 bg-brand-secondary/80 terminal-cursor" />
                    </div>
                  </div>

                  {/* Typing input bar */}
                  <form onSubmit={handleTerminalSubmit} className="flex gap-2 border-t border-gray-900 pt-3 mt-3">
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type a query (e.g. assistance, help, secret)..."
                      className="flex-1 bg-gray-950 border border-gray-850 focus:border-brand-secondary rounded px-3 py-1.5 text-xs text-gray-250 focus:outline-none focus:ring-1 focus:ring-brand-secondary font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-brand-secondary rounded text-xs transition-colors cursor-pointer"
                    >
                      Execute
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. Stats Bento layout */}
        <section className="py-8 border-t border-gray-900 mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '5+', label: 'Years Experience', sub: 'High-frequency systems' },
              { num: '30+', label: 'Products Shipped', sub: 'Production deploy' },
              { num: '1.2k+', label: 'Git Contributions', sub: 'Over past calendar year' },
              { num: '99.9%', label: 'Uptime Maintained', sub: 'Responsive architectures' },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-brand-card/30 hover:bg-brand-card/65 border border-gray-900 hover:border-gray-800 rounded-2xl p-5 hover:scale-[1.01] transition-all flex flex-col justify-between"
              >
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-brand-secondary to-indigo-400 bg-clip-text text-transparent mb-1">
                  {stat.num}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">{stat.label}</h4>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. About Me Section */}
        <section id="about" className="py-14 border-t border-gray-900 scroll-mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Visual portrait illustration */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative group max-w-sm mx-auto w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-primary/20 via-brand-secondary/15 to-transparent border border-gray-800 p-3 select-none">
                <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-[1px] group-hover:opacity-0 transition-opacity duration-300" />
                <div className="w-full h-full rounded-xl bg-gray-950 flex flex-col items-center justify-center border border-gray-900 relative overflow-hidden">
                  {/* Digital backdrop grid */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-15" />
                  
                  {/* Aesthetic visual profile graphic */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-4xl shadow-lg relative z-10 mb-4 scale-95 group-hover:scale-100 transition-transform duration-500">
                    💻
                  </div>
                  <h3 className="text-lg font-bold text-white relative z-10">Awais Chohan</h3>
                  <p className="text-xs text-brand-secondary font-mono relative z-10 mt-1 mb-3">~/staff_systems_engineer</p>
                  
                  {/* Simulated terminal lines */}
                  <div className="w-5/6 p-2 bg-gray-900/80 rounded border border-gray-850 font-mono text-[9px] text-gray-450 leading-normal text-left">
                    <span className="text-green-400">⚡ system_check:</span> active<br />
                    <span className="text-indigo-400">⚡ region      :</span> ASIA-SE-1<br />
                    <span className="text-cyan-400">⚡ frameworks  :</span> TypeScript, Node, React19
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative about portfolio author */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                  Forging elegant products with robust codebases.
                </h2>
                <div className="space-y-4 text-gray-400 text-sm leading-relaxed font-light">
                  <p>
                    I am a software engineer focused on designing lightweight systems that operate with minimum overhead and supreme responsiveness. Driven by structural minimalism, I make sure visual modules are clean, typography is legible, and backend sync pipelines run securely.
                  </p>
                  <p>
                    Currently working as a Staff Full Stack Engineer, I lead frontend optimization sprints and establish secure Cloud structures. Outside of commercial software, I contribute heavily to reactive libraries and developer productivity utilities.
                  </p>
                </div>
              </div>

              {/* Bullet details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-900">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4.5 h-4.5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Full Stack Focus</h4>
                    <p className="text-[11.5px] text-gray-500 mt-0.5">End-to-end modular development.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-4.5 h-4.5 text-brand-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">AI Grounding Integration</h4>
                    <p className="text-[11.5px] text-gray-500 mt-0.5">Automated prompt and LLM engineering.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Skills Section with Interactive Category Filter */}
        <section id="skills" className="py-14 border-t border-gray-900 scroll-mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Core Competencies</h2>
              <p className="text-sm text-gray-500 mt-1 font-mono">Curated toolboxes for production deployment</p>
            </div>
            {/* Quick Filter Info */}
            <div className="text-[11px] font-mono text-gray-500 mt-2 md:mt-0 flex items-center gap-1.5 bg-gray-950 border border-gray-900 px-3 py-1 rounded-full">
              <span>Primary Tech:</span>
              <span className="text-brand-secondary font-bold">TypeScript / React 19</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className="bg-brand-card/45 border border-gray-900 hover:border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-gray-900 group-hover:bg-brand-bg transition-colors border border-gray-850">
                    {skill.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{skill.name}</h4>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{skill.category}</span>
                  </div>
                </div>
                {/* Visual Bar representation */}
                <div className="flex items-center gap-4 w-1/3 md:w-1/2">
                  <div className="flex-1 bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-900">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${
                        skill.category === 'frontend' ? 'from-indigo-500 to-cyan-400' :
                        skill.category === 'backend' ? 'from-green-500 to-emerald-400' :
                        'from-violet-500 to-pink-500'
                      }`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 w-8 text-right">{skill.level}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Interactive Projects Grid with Details Modal */}
        <section id="projects" className="py-14 border-t border-gray-900 scroll-mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Showcase Portfolio</h2>
              <p className="text-sm text-gray-500 mt-1 font-mono">Filterable projects by functional deployment categories</p>
            </div>
            
            {/* Category selection */}
            <div className="flex items-center gap-1.5 mt-4 md:mt-0 flex-wrap">
              {(['all', 'frontend', 'backend', 'ai', 'fullstack'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveProjectFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                    activeProjectFilter === cat
                      ? 'bg-brand-secondary text-brand-bg font-semibold'
                      : 'bg-brand-card hover:bg-gray-900 text-gray-400 border border-gray-850 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-brand-card border border-gray-850 hover:border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-950/10 group transition-all"
                >
                  {/* Styled Gradient Block */}
                  <div className={`h-40 bg-gradient-to-br ${p.imageColor} relative p-5 flex flex-col justify-between overflow-hidden`}>
                    <div className="absolute inset-0 bg-brand-bg/10 backdrop-blur-[2px]" />
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-12 translate-x-12 blur-md" />
                    
                    <span className="inline-block px-2 py-0.5 rounded bg-white/10 backdrop-blur-md text-[10px] text-white font-mono uppercase tracking-wider font-semibold self-start relative z-10 border border-white/15">
                      {p.category}
                    </span>
                    
                    <div className="relative z-10 text-white font-mono text-[10.5px] font-bold bg-gray-950/40 backdrop-blur-sm self-start px-2.5 py-1 rounded border border-white/5">
                      {p.stats}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-secondary transition-colors mb-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                        {p.description}
                      </p>
                    </div>

                    {/* Tech badging and visual CTA link */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-850 text-gray-500 font-mono text-[9px]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-900">
                        <button
                          onClick={() => setSelectedProject(p)}
                          className="text-xs font-semibold text-brand-secondary flex items-center gap-1 hover:underline"
                        >
                          Technical Overview
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center space-x-2">
                          <a 
                            href={p.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
                            title="View Github Code"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                          <a 
                            href={p.liveUrl}
                            className="p-1.5 rounded-md hover:bg-gray-900 text-gray-450 hover:text-brand-secondary transition-colors"
                            title="Interactive Preview"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Project Details Dialog / Modal Overlay */}
          <AnimatePresence>
            {selectedProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedProject(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Dialog content box */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-brand-card border border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10"
                >
                  <div className={`h-32 bg-gradient-to-br ${selectedProject.imageColor} p-5 flex items-center justify-between`}>
                    <h3 className="text-xl font-extrabold text-white drop-shadow-md">
                      {selectedProject.title}
                    </h3>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-1.5 rounded-full bg-black/45 hover:bg-black/80 text-white transition-colors"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-secondary">
                        Operational Scope
                      </span>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {selectedProject.detail}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-400 block mb-1">
                        Applied Framework Modules
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedProject.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-gray-950 border border-gray-900 text-gray-300 font-mono text-[9.5px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-900 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-mono">{selectedProject.stats}</span>
                      <div className="flex gap-2">
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-white font-medium"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Codebase
                        </a>
                        <button
                          onClick={() => {
                            alert(`Success! Opening interactive simulation of ${selectedProject.title}.`);
                            setSelectedProject(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-secondary hover:bg-brand-secondary/80 text-brand-bg font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live View
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* 8. Career & Academic Milestones Timeline */}
        <section id="experience" className="py-14 border-t border-gray-900 scroll-mt-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Milestone Timeline</h2>
              <p className="text-sm text-gray-500 mt-1 font-mono">Academic research and enterprise career progression</p>
            </div>

            <div className="relative border-l border-gray-850 ml-3 sm:ml-6 space-y-8 pb-4">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline bullet nodes */}
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-brand-bg flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                    item.type === 'work' ? 'border-brand-primary' : 'border-brand-secondary'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      item.type === 'work' ? 'bg-brand-primary' : 'bg-brand-secondary'
                    }`} />
                  </div>

                  {/* Body Content wrapper */}
                  <div className="bg-brand-card/30 hover:bg-brand-card/60 border border-gray-900 hover:border-gray-800 rounded-xl p-5 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <span className="inline-block text-[10px] font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded self-start font-semibold">
                        {item.period}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                        {item.type === 'work' ? <Briefcase className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                        {item.type === 'work' ? 'Enterprise Contract' : 'Academic Degree'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-0.5">
                      {item.role}
                    </h3>
                    <h5 className="text-xs text-indigo-400 font-medium mb-3">
                      {item.company}
                    </h5>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Interactive Contact Form with Inbox Simulated Logger */}
        <section id="contact" className="py-14 border-t border-gray-900 scroll-mt-10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left direct channel description */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Let's Connect</h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Have a challenging project scope or need modular architecture engineering advice? Send a pipeline message directly.
                </p>
              </div>

              {/* Direct channels */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gray-900/60 border border-gray-850 flex items-center justify-center shrink-0">
                    <Mail className="w-4.5 h-4.5 text-brand-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono">Primary Email</h5>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-white truncate">pubgokplayer@gmail.com</p>
                      <button 
                        onClick={copyEmailToClipboard}
                        className="p-1 rounded hover:bg-gray-900 text-gray-500 hover:text-white transition-colors"
                        title="Copy to Clipboard"
                      >
                        {copiedEmail ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gray-900/60 border border-gray-850 flex items-center justify-center shrink-0">
                    <Phone className="w-4.5 h-4.5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold font-mono">Work Location</h5>
                    <p className="text-xs font-semibold text-white">Singapore / West Coast HQ</p>
                  </div>
                </div>
              </div>

              {/* Visual Simulated Mock Client-Side Inbound Monitor */}
              <div className="p-4 rounded-xl bg-brand-card/45 border border-gray-900">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <Inbox className="w-4 h-4" />
                    <span className="font-bold tracking-tight">Local Sent Box ({storedMessages.length})</span>
                  </div>
                  {storedMessages.length > 0 && (
                    <button 
                      onClick={clearInboundMessages}
                      className="text-[10px] text-red-400/80 hover:text-red-400"
                    >
                      [Clear Log]
                    </button>
                  )}
                </div>

                {storedMessages.length === 0 ? (
                  <p className="text-[10.5px] text-gray-500 italic font-light">
                    No recent transmission payloads found. Submit the pipeline form to see local states update in real-time.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                    {storedMessages.map((msg) => (
                      <div key={msg.id} className="p-2.5 rounded bg-gray-950 border border-gray-900 font-mono text-[10.5px]">
                        <div className="flex items-center justify-between text-gray-450 border-b border-gray-900 pb-1 mb-1">
                          <span className="font-bold text-white truncate max-w-[120px]">{msg.name}</span>
                          <span className="text-[9px] shrink-0 text-brand-secondary">{msg.timestamp}</span>
                        </div>
                        <p className="text-gray-400 break-words leading-relaxed select-text font-light">"{msg.message}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right direct inbound email form */}
            <div className="lg:col-span-7 bg-brand-card border border-gray-850 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-1.5">Direct Communication Terminal</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Send context message. Local checks validate entries before generating mock synchronization signals.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-gray-950 border border-gray-850 focus:border-brand-secondary rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">
                      Inbound Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. contact@domain.com"
                      className="w-full bg-gray-950 border border-gray-850 focus:border-brand-secondary rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">
                    Message Payload
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessageText}
                    onChange={(e) => setContactMessageText(e.target.value)}
                    placeholder="Describe your design specifications or software scope details..."
                    className="w-full bg-gray-950 border border-gray-850 focus:border-brand-secondary rounded-xl p-4 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-secondary transition-colors resize-none"
                  />
                </div>

                {/* Validation Status message */}
                <AnimatePresence>
                  {subMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`p-3 rounded-lg text-xs leading-normal font-mono ${
                        subMessage.type === 'success' 
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                          : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }`}
                    >
                      {subMessage.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary/85 text-white text-xs font-semibold hover:shadow-lg hover:shadow-brand-primary/10 transition-all ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.01]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Syncing Payload...
                    </>
                  ) : (
                    <>
                      Submit Contact Request
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* 10. Footer Section */}
      <footer className="border-t border-gray-950 bg-gray-950/80 backdrop-blur-md py-8 mt-12 relative z-10 font-mono text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-gray-900 text-white flex items-center justify-center font-bold text-[11px] border border-gray-800">
              A
            </span>
            <span className="font-semibold text-gray-300">Awais Chohan</span>
            <span>• Built in 2026</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Github</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#hero" className="hover:text-white transition-colors">Back to Top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
