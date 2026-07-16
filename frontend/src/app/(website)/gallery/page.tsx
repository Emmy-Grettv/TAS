'use client';
import Link from 'next/link';
import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

const galleryItems = [
  { img: '/images/IMG-20260714-WA0005.jpg' },
  { img: '/images/IMG-20260714-WA0006.jpg' },
  { img: '/images/IMG-20260714-WA0007.jpg' },
  { img: '/images/IMG_4212.jpg' },
  { img: '/images/IMG_4214.jpg' },
  { img: '/images/IMG_4216.jpg' },
  { img: '/images/IMG_4219.jpg' },
  { img: '/images/IMG_4256.JPG' },
  { img: '/images/IMG_4257.JPG' },
  { img: '/images/IMG_4258.JPG' },
  { img: '/images/IMG_4262.JPG' },
  { img: '/images/IMG_4293.jpg' },
  { img: '/images/IMG_4342.jpg' },
  { img: '/images/IMG_4346.jpg' },
  { img: '/images/IMG_4349.jpg' },
  { img: '/images/IMG_4496.jpg' },
  { img: '/images/IMG_4500.JPG' },
  { img: '/images/IMG_4753.jpg' },
  { img: '/images/IMG_4754.jpg' },
  { img: '/images/IMG_4755.jpg' },
  { img: '/images/IMG_4804.jpg' },
  { img: '/images/IMG_4821.jpg' },
  { img: '/images/IMG_4827.jpg' },
  { img: '/images/IMG_4829.jpg' },
  { img: '/images/IMG_4830.jpg' },
  { img: '/images/IMG_4833.jpg' },
  { img: '/images/IMG_6536.jpg' },
  { img: '/images/IMG_6572.jpg' },
  { img: '/images/IMG_6574.jpg' },
  { img: '/images/IMG_6575.jpg' },
  { img: '/images/IMG_6576.jpg' },
  { img: '/images/IMG_6581.jpg' },
  { img: '/images/IMG_6583.jpg' },
  { img: '/images/IMG_6585.jpg' }
];

const getLabel = (imgSrc: string) => {
  const filename = imgSrc.split('/').pop() || '';
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  
  if (nameWithoutExt.startsWith('IMG-')) {
    const parts = nameWithoutExt.split('-');
    const lastPart = parts[parts.length - 1]; // e.g. WA0005
    return `Tegano Activity - ${lastPart}`;
  } else if (nameWithoutExt.startsWith('IMG_')) {
    const num = nameWithoutExt.substring(4); // e.g. 4212
    return `Tegano Activity - ${num}`;
  }
  return 'Tegano Activity';
};

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<{ img: string; label: string } | null>(null);

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

      {/* ── Gallery grid ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {galleryItems.map(item => {
              const label = getLabel(item.img);
              return (
                <button
                  key={item.img}
                  onClick={() => setLightbox({ img: item.img, label })}
                  className="group relative overflow-hidden rounded-md bg-slate-200 block w-full mb-4 break-inside-avoid cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={item.img}
                    alt={label}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 w-full bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent text-left">
                      <span className="text-white font-semibold text-sm block translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{label}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white hover:scale-105 transition-all shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative bg-slate-900 flex items-center justify-center max-h-[75vh]">
              <img
                src={lightbox.img}
                alt={lightbox.label}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
            <div className="p-5 bg-white">
              <h3 className="font-bold text-lg text-slate-900">{lightbox.label}</h3>
              <p className="text-sm text-slate-500 mt-1">Tegano Recreation Center</p>
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
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#29A8C4] text-white font-semibold rounded-md hover:bg-[#1e8fa8] transition-colors">
            Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
