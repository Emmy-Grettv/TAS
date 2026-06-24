'use client';
import Link from 'next/link';
import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const categories = ['All', 'Rides', 'Water', 'Sports', 'Creative', 'Facility'];

const galleryItems = [
  { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800', label: 'Electric Go-Kart Track', cat: 'Rides', wide: true },
  { img: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&q=80&w=600', label: 'Water Splash Pool', cat: 'Water' },
  { img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600', label: 'Giant Bouncy Castle', cat: 'Rides' },
  { img: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&q=80&w=600', label: 'Inflatable Water Slide', cat: 'Water' },
  { img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600', label: 'Arts & Crafts Session', cat: 'Creative' },
  { img: 'https://images.unsplash.com/photo-1628268909376-e2f244955ab0?auto=format&fit=crop&q=80&w=600', label: 'Colourful Carousel', cat: 'Rides' },
  { img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800', label: 'Sports Day', cat: 'Sports', wide: true },
  { img: 'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?auto=format&fit=crop&q=80&w=600', label: 'Trampoline Zone', cat: 'Sports' },
  { img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&q=80&w=600', label: 'Mini Car Rides', cat: 'Rides' },
  { img: 'https://images.unsplash.com/photo-1519400197429-404ae518e4b2?auto=format&fit=crop&q=80&w=600', label: 'Climbing Wall', cat: 'Sports' },
  { img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600', label: 'Music & Dance', cat: 'Creative' },
  { img: '/images/recreation_center_1782114747136.png', label: 'The Facility', cat: 'Facility' },
];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<typeof galleryItems[0] | null>(null);

  const filtered = active === 'All' ? galleryItems : galleryItems.filter(g => g.cat === active);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-slate-900 pt-20 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">Gallery</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Our Gallery</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">A glimpse into the fun, laughter, and memories made at Tegano.</p>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-2 justify-center">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active === c
                  ? 'bg-[#29A8C4] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Gallery grid ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map(item => (
              <button
                key={item.label}
                onClick={() => setLightbox(item)}
                className={`group relative overflow-hidden rounded-xl bg-slate-200 block w-full cursor-pointer ${item.wide ? 'col-span-2' : ''}`}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 w-full">
                    <span className="text-white font-semibold text-xs block">{item.label}</span>
                    <span className="text-white/70 text-xs">{item.cat}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-lg w-full relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={lightbox.img}
              alt={lightbox.label}
              className="w-full object-cover max-h-96"
            />
            <div className="p-4">
              <h3 className="font-bold text-slate-900">{lightbox.label}</h3>
              <span className="text-xs text-[#29A8C4] font-medium">{lightbox.cat}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Create Your Own Memories Here!</h2>
          <p className="text-slate-400 mb-8">Book a visit and be part of the joy.</p>
          <Link href="/book-now"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#29A8C4] text-white font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
            Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
