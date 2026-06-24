import Link from 'next/link';
import { Clock, Users, Calendar, ArrowRight } from 'lucide-react';

const activities = [
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    title: 'Electric Go-Kart Racing', cat: 'Rides',
    desc: 'Mini electric go-karts on our safe, professionally designed track.',
    age: '6–14 yrs', duration: '20 min', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&q=80&w=600',
    title: 'Mini Electric Car Rides', cat: 'Rides',
    desc: 'Battery-powered mini cars in a supervised circuit for younger kids.',
    age: '3–8 yrs', duration: '15 min', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1628268909376-e2f244955ab0?auto=format&fit=crop&q=80&w=600',
    title: 'Carousel Ride', cat: 'Rides',
    desc: 'A gently rotating carousel with colourful vehicle seats loved by all.',
    age: '3–12 yrs', duration: '10 min', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600',
    title: 'Bouncy Castles', cat: 'Rides',
    desc: 'Giant inflatables where children can jump and bounce freely.',
    age: '3–12 yrs', duration: 'Open play', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&q=80&w=600',
    title: 'Water Splash Pool', cat: 'Water',
    desc: 'A shallow, supervised splash pool for water play on hot days.',
    age: '3–10 yrs', duration: '30 min', schedule: 'Oct–Apr',
  },
  {
    img: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&q=80&w=600',
    title: 'Inflatable Water Slides', cat: 'Water',
    desc: 'Exciting inflatable slides into the pool — supervised and safe.',
    age: '5–14 yrs', duration: '30 min', schedule: 'Oct–Apr',
  },
  {
    img: 'https://images.unsplash.com/photo-1519400197429-404ae518e4b2?auto=format&fit=crop&q=80&w=600',
    title: 'Inflatable Climbing Wall', cat: 'Sports',
    desc: 'A soft climbing wall that challenges and builds confidence.',
    age: '5–14 yrs', duration: '15 min', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?auto=format&fit=crop&q=80&w=600',
    title: 'Trampoline Zone', cat: 'Sports',
    desc: 'Jump safely under supervision. Great for energy and coordination.',
    age: '4–14 yrs', duration: 'Open play', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
    title: 'Team Sports & Relays', cat: 'Sports',
    desc: 'Soccer, relay races, and group games encouraging teamwork.',
    age: '5–14 yrs', duration: '45 min', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600',
    title: 'Arts & Crafts Studio', cat: 'Creative',
    desc: 'Painting, clay modelling, and DIY crafts that spark imagination.',
    age: '4–12 yrs', duration: '45 min', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600',
    title: 'Music & Dance', cat: 'Creative',
    desc: 'Rhythm games and guided dance sessions for self-expression.',
    age: '3–12 yrs', duration: '30 min', schedule: 'All days',
  },
  {
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
    title: 'Educational Play', cat: 'Educational',
    desc: 'Interactive learning games and puzzles for curious young minds.',
    age: '4–10 yrs', duration: '30 min', schedule: 'All days',
  },
];

export default function ActivitiesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-slate-900 pt-20 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">12 Amazing Activities</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Activities Kids Absolutely Love</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">From high-speed go-karts to peaceful arts sessions — something exciting for every child.</p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map(a => (
              <div key={a.title}
                className="bg-white rounded-xl border border-slate-100 hover:border-[#29A8C4]/30 hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 text-xs bg-white text-[#29A8C4] font-semibold px-2.5 py-1 rounded-full shadow-sm">{a.cat}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-1.5">{a.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{a.desc}</p>

                  <div className="flex gap-4 text-xs text-slate-500 border-t border-slate-50 pt-4 mb-4">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#29A8C4]" />{a.age}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" />{a.duration}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" />{a.schedule}</span>
                  </div>

                  <Link href="/book-now"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 border border-slate-200 hover:bg-[#29A8C4] hover:border-[#29A8C4] hover:text-white text-slate-600 text-sm font-medium rounded-lg transition-all duration-200">
                    Register <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Book These Activities?</h2>
          <p className="text-slate-400 mb-8">Group rates available. Schools and community groups welcome.</p>
          <Link href="/book-now"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#29A8C4] text-white font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
            Book a Group Visit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
