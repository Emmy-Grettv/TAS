'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import './website.css';

type NavItem = {
  href?: string;
  label: string;
  children?: { href: string; label: string }[];
};

const nav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/activities', label: 'Activities' },
  { 
    label: 'Packages',
    children: [
      { href: '/packages/school', label: 'School Packages' },
      // { href: '/packages/party', label: 'Party Packages' }
    ]
  },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/#contact', label: 'Contact' },
];

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Packages & restaurant pages force a permanently white header
  const isWhiteHeaderPage = pathname.startsWith('/packages') || pathname.startsWith('/restaurant');
  const scrollThreshold = isWhiteHeaderPage ? -1 : 10;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold);
    window.addEventListener('scroll', onScroll);
    onScroll(); // run once on mount to set correct initial state
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollThreshold]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="website-root min-h-screen flex flex-col">
      {/* ── Header Wrapper (Overlay over Hero) ── */}
      <div className="header-wrapper">
        {/* ── Top bar ── */}
        {/* <div className="hidden md:block topbar-strip">
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <a href="tel:+263781499656" className="topbar-link">
                <Phone className="w-3 h-3" /> +263 781 499 656
              </a>
              <a href="mailto:teganoinvestmentpvtltd@gmail.com" className="topbar-link">
                <Mail className="w-3 h-3" /> teganoinvestmentpvtltd@gmail.com
              </a>
            </div>
            <span className="topbar-hours">Mon–Fri 08:00–17:00 &nbsp;|&nbsp; Sat 08:00–16:00</span>
          </div>
        </div> */}

        {/* ── Header ── */}
        <header
          className={`site-header transition-all duration-300 ${
            scrolled ? 'site-header--scrolled animate-fade-in' : 'site-header--top'
          }`}
        >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="Tegano Recreation Center"
                width={180}
                height={80}
                className="h-14 w-auto object-contain header-logo"
                priority
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5">
            {nav.map(n => (
              n.children ? (
                <div key={n.label} className="relative group">
                  <button className="nav-link">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {n.label}
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
                    {n.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`px-4 py-2 text-sm font-medium hover:bg-slate-50 hover:text-accent-teal transition-colors ${isActive(child.href) ? 'text-[#29A8C4]' : 'text-slate-700'}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={n.href}
                  href={n.href!}
                  className={`nav-link ${
                    isActive(n.href!) ? 'nav-link--active' : ''
                  }`}
                >
                  {n.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Book Now */}
          <div className="hidden lg:flex flex-1 items-center justify-end">
            <Link href="/book-now" className="nav-book-btn">
              Book Now
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/book-now" className="nav-book-btn text-xs px-4 py-2">
              Book Now
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg transition-colors mobile-menu-btn"
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
              n.children ? (
                <div key={n.label} className="flex flex-col gap-1">
                  <div className="px-3 py-2.5 rounded-lg text-sm font-bold text-slate-900 bg-slate-50">
                    {n.label}
                  </div>
                  <div className="pl-6 flex flex-col gap-0.5">
                    {n.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMenuOpen(false)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive(child.href)
                            ? 'text-[#29A8C4] '
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={n.href}
                  href={n.href!}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(n.href!)
                      ? 'text-[#29A8C4] '
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {n.label}
                </Link>
              )
            ))}
          </div>
        )}
      </header>
      </div>

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
                {[...nav.flatMap(n => n.children ? n.children : [{ href: n.href || '', label: n.label }]), { href: '/book-now', label: 'Book Now' }].map(n => (
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
                className="mt-6 inline-block px-5 py-2 bg-[#29A8C4] text-white text-xs font-semibold rounded-md hover:bg-[#1e8fa8] transition-colors">
                Book a Visit
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
