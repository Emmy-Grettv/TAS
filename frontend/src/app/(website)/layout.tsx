'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import './website.css';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/activities', label: 'Activities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="website-root min-h-screen flex flex-col">
      {/* ── Top bar ── */}
      <div className="hidden md:block bg-[#29A8C4] text-white text-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <a href="tel:+263781499656" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Phone className="w-3 h-3" /> +263 781 499 656
            </a>
            <a href="mailto:teganoinvestmentpvtltd@gmail.com" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Mail className="w-3 h-3" /> teganoinvestmentpvtltd@gmail.com
            </a>
          </div>
          <span className="text-white">Mon–Fri 08:00–17:00 &nbsp;|&nbsp; Sat 08:00–16:00</span>
        </div>
      </div>

      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white backdrop-blur-md shadow-sm border-b border-slate-100'
            : 'bg-white backdrop-blur-sm'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-24 gap-8">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="Tegano Recreation Center"
                width={180}
                height={80}
                className="h-16 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {nav.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(n.href)
                    ? 'text-[#29A8C4]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Book Now */}
          <div className="hidden lg:flex flex-1 items-center justify-end">
            <Link
              href="/book-now"
              className="px-5 py-2 bg-[#29A8C4] text-white text-sm font-semibold rounded-lg hover:bg-[#1e8fa8] transition-all duration-200 shadow-sm"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/book-now" className="px-4 py-2 bg-[#29A8C4] text-white text-xs font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
              Book Now
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-3 flex flex-col gap-0.5">
            {nav.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(n.href)
                    ? 'text-[#29A8C4] '
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white mt-10">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Image
                src="/logo.png"
                alt="Tegano Recreation Center"
                width={110}
                height={48}
                className="h-9 w-auto object-contain brightness-0 invert opacity-80 mb-4"
              />
              <p className="text-xs text-white mb-5 leading-relaxed">
                Fun, safe, and professionally supervised activities for children of all ages in Harare, Zimbabwe.
              </p>
              <div className="flex gap-2">
                {[
                  { label: 'Facebook', d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                  { label: 'Instagram', d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                ].map(s => (
                  <a key={s.label} href="#" aria-label={s.label}
                    className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white hover:bg-[#29A8C4] hover:text-white transition-all duration-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.d} /></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Pages</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[...nav, { href: '/book-now', label: 'Book Now' }].map(n => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-sm text-white hover:text-white/80 transition-colors">{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                  <span>26 Princess Drive, Newlands, Harare</span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Phone className="w-4 h-4 shrink-0 text-white" />
                  <a href="tel:+263781499656" className="hover:text-white transition-colors">+263 781 499 656</a>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Mail className="w-4 h-4 shrink-0 text-white" />
                  <a href="mailto:teganoinvestmentpvtltd@gmail.com" className="hover:text-white transition-colors text-xs">teganoinvestmentpvtltd@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Hours</h4>
              <ul className="space-y-2 text-sm">
                {[['Mon – Fri', '08:00 – 17:00'], ['Saturday', '08:00 – 16:00'], ['Sunday', '09:00 – 14:00']].map(([day, hrs]) => (
                  <li key={day} className="flex justify-between gap-4">
                    <span>{day}</span>
                    <span className="text-white font-medium">{hrs}</span>
                  </li>
                ))}
              </ul>
              <Link href="/book-now"
                className="mt-6 inline-block px-5 py-2 bg-[#29A8C4] text-white text-xs font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
                Book a Visit
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-xs text-white gap-2">
            <p>© {new Date().getFullYear()} Tegano Recreation Center. All rights reserved.</p>
            <p>Made with care for children&apos;s joy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
