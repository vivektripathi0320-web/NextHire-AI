import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, Github } from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Resume Builder', path: '/resume-generator' },
    { name: 'Enhancer', path: '/resume-enhancer' },
    { name: 'ATS Scan', path: '/ats-analyzer' },
    { name: 'Portfolio', path: '/portfolio-builder' },
    { name: 'JD Match', path: '/jd-matcher' },
  ];

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col grid-bg relative">
      <div className="absolute top-0 left-0 w-full h-[500px] radial-gradient-overlay pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-zinc-50 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] transition-transform duration-300 group-hover:scale-105">
                  <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-background">
                    <Sparkles className="h-5 w-5 text-primary group-hover:text-zinc-50 transition-colors" />
                  </div>
                </div>
                <span className="font-heading font-bold text-xl tracking-tight transition-colors group-hover:text-white">
                  NextHire<span className="text-primary">.AI</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-300 hover:text-white ${
                      isActive ? 'text-primary nav-active-glow' : 'text-zinc-400'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/about"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                to="/resume-generator"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-primary-glow transition-all hover:bg-primary/80 hover:scale-[1.02] active:scale-[0.98] pulse-glow-button"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-white/5 animate-fade-in px-4 pt-2 pb-6 space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-base font-medium py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${
                    isActive ? 'text-primary bg-primary/5' : 'text-zinc-400'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-2 px-3 text-zinc-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                to="/resume-generator"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-base font-medium text-white shadow-primary-glow"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0b0b0e] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-heading font-bold text-lg text-white">NextHire.AI</span>
              </div>
              <p className="text-sm text-zinc-500">
                AI-powered resume building, optimization, and stunning web portfolios for the modern professional.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-zinc-300 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link to="/resume-generator" className="hover:text-primary transition-colors">AI Resume Generator</Link></li>
                <li><Link to="/resume-enhancer" className="hover:text-primary transition-colors">AI Resume Enhancer</Link></li>
                <li><Link to="/ats-analyzer" className="hover:text-primary transition-colors">ATS Score Analyzer</Link></li>
                <li><Link to="/portfolio-builder" className="hover:text-primary transition-colors">Portfolio Generator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-zinc-300 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-zinc-300 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><span className="cursor-not-allowed text-zinc-600">Privacy Policy</span></li>
                <li><span className="cursor-not-allowed text-zinc-600">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} NextHire AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
