'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, ArrowRightIcon } from 'lucide-react';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(to_bottom_right,var(--bg-start),var(--bg-end))] dark:bg-[linear-gradient(to_bottom_right,var(--bg-dark-start),var(--bg-dark-end))] transition-colors">
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="font-extrabold text-xl text-primary">BrandName</div>
          <nav className="hidden md:flex gap-6 ml-6">
            {['Home', 'Features', 'Pricing', 'Docs', 'Contact'].map((t) => (
              <a
                key={t}
                href="#"
                className="relative text-sm font-medium text-text DEFAULT hover:text-primary transition-colors before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-accent before:transition-all hover:before:w-full"
              >
                {t}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle theme"
            onClick={() => setIsDark((d) => !d)}
            className="p-2 rounded-full border border-border-light dark:border-border flex items-center justify-center hover:bg-accent/10 transition"
          >
            {isDark ? <SunIcon className="w-5 h-5 text-text" /> : <MoonIcon className="w-5 h-5 text-text" />}
          </button>
          <button className="px-5 py-2 rounded-lg bg-primary hover:bg-accent text-white text-sm font-semibold transition">
            Get Started
          </button>
          <div className="md:hidden ml-2">
            <div className="w-6 h-6 bg-primary rounded" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 px-6 py-16 max-w-7xl mx-auto flex-1">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">Build beautiful products with confidence</h1>
          <p className="mt-4 text-base text-muted max-w-md">
            A modern design system, responsive components, and an easy theme switcher—get started quickly with a polished UI that adapts to
            light and dark modes seamlessly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-accent text-white font-semibold transition">
              Start Free Trial <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 rounded-xl border border-border-light dark:border-border text-text hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 transition">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-surface-light dark:bg-surface-dark p-6">
            <div className="w-full h-60 bg-gradient-to-br from-[#5aa9ff] to-[#1f375e] rounded-xl flex items-center justify-center text-white font-bold text-lg">
              Hero Illustration Placeholder
            </div>
            <div className="mt-4">
              <div className="text-sm text-muted mb-2">Featured in</div>
              <div className="flex gap-3">
                <div className="h-8 w-20 bg-white/30 rounded" />
                <div className="h-8 w-20 bg-white/30 rounded" />
                <div className="h-8 w-20 bg-white/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center">Core Features</h2>
          <p className="mt-2 text-center text-muted max-w-xl mx-auto">
            Everything you need to launch and scale, with thoughtful defaults and accessible components.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Responsive Design',
                desc: 'Looks great on any screen size, mobile-first and accessible by default.',
                icon: '📱'
              },
              {
                title: 'Theme Switcher',
                desc: 'Light and dark modes that respect user preference and system settings.',
                icon: '🌓'
              },
              {
                title: 'Prebuilt Components',
                desc: 'Buttons, cards, inputs, and more—styled and composable out of the box.',
                icon: '🧰'
              }
            ].map((f) => (
              <div
                key={f.title}
                className="relative group bg-white shadow-lg dark:bg-deep-slate rounded-2xl p-6 border border-border-light dark:border-border hover:shadow-xl transition"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-4 font-semibold text-xl text-primary">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.desc}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-accent group-hover:underline">
                  Learn more <ArrowRightIcon className="w-4 h-4 ml-1" />
                </div>
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-30 transition bg-accent rounded-bl-2xl w-16 h-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent rounded-2xl p-10 text-white flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mt-2">Join thousands of builders using this system to ship faster and look great doing it.</p>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:opacity-90 transition">
              Create account
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white/10 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(31,42,55,0.9)] border-t border-border-light dark:border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="font-bold text-xl text-primary mb-2">BrandName</div>
            <p className="text-sm text-muted">A thoughtful UI toolkit and landing page to help you ship polished interfaces quickly.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="font-semibold mb-2 text-text">Product</div>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Releases
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2 text-text">Company</div>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold mb-2 text-text">Subscribe</div>
            <p className="text-sm text-muted mb-3">Get updates, tips, and early access.</p>
            <div className="flex gap-2 flex-wrap">
              <input
                aria-label="Email"
                type="email"
                placeholder="you@example.com"
                className="flex-1 min-w-[180px] px-4 py-2 rounded-lg border border-border-light dark:border-border bg-white dark:bg-deep-slate placeholder:italic focus:outline-none"
              />
              <button className="px-5 py-2 rounded-lg bg-primary hover:bg-accent text-white font-medium transition">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-xs text-muted">© {new Date().getFullYear()} BrandName. All rights reserved.</div>
      </footer>

      {/* CSS Vars for palette (inline for demo; ideally move to global CSS) */}
      <style jsx global>{`
        :root {
          --bg-start: #fff1eb;
          --bg-end: #ace0f9;
          --bg-dark-start: #0f172a;
          --bg-dark-end: #1e2a44;

          --primary: #1f375e;
          --accent: #5aa9ff;
          --surface-light: #f5f7fa;
          --surface-dark: #1f2a37;
          --border-light: #d9e2ec;
          --border-dark: #2e3a5a;
          --text: #1f2a37;
          --muted: #6b7a91;
        }

        .dark {
          --bg-start: #0f172a;
          --bg-end: #1e2a44;
        }

        .text-primary {
          color: var(--primary);
        }

        .text-muted {
          color: var(--muted);
        }

        .bg-primary {
          background-color: var(--primary);
        }

        .bg-accent {
          background-color: var(--accent);
        }

        .bg-surface-light {
          background-color: var(--surface-light);
        }

        .bg-surface-dark {
          background-color: var(--surface-dark);
        }

        .border-border-light {
          border-color: var(--border-light);
        }

        .border-border {
          border-color: var(--border-light);
        }
      `}</style>
    </div>
  );
}
