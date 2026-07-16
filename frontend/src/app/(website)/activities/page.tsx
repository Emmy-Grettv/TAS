import Link from 'next/link';
import { Clock, Users, Calendar, ArrowRight } from 'lucide-react';

const activities = [
  {
    img: '/images/IMG_4256.jpg',
    title: 'Electric Go-Kart Racing', cat: 'Rides',
    desc: 'Students drive mini electric go-karts on a safe track designed for children.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
    img: '/images/IMG_4214.jpg',
    title: 'Mini Electric Car & Motorcycle Rides', cat: 'Rides',
    desc: 'Children ride battery-powered cars and motorcycles in a supervised driving area.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
    img: '/images/IMG_4827.jpg',
    title: 'Carousel Rotating Ride', cat: 'Rides',
    desc: 'A gentle rotating ride with colorful vehicles designed for younger children.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
    img: '/images/IMG_4219.jpg',
    title: 'Inflatable Bouncy Castles', cat: 'Play',
    desc: 'Large inflatable castles where children can jump and bounce safely.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
     img: '/images/IMG_4214.jpg',
    title: 'Inflatable Adventure Play Structures', cat: 'Play',
    desc: 'Inflatable play zones with climbing, sliding, and jumping sections.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
    img: '/images/IMG_4346.jpg',
    title: 'Water Splash Pool Play', cat: 'Water',
    desc: 'A shallow splash pool where children can enjoy safe water play.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
     img: '/images/IMG_4342.jpg',
    title: 'Inflatable Water Slides', cat: 'Water',
    desc: 'Inflatable slides allowing children to climb and slide into the splash pool.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
     img: '/images/IMG_4262.jpg',
    title: 'Inflatable Water Climbing Wall', cat: 'Water',
    desc: 'A soft inflatable climbing wall placed in the pool for balance and fun.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
    img: '/images/IMG_4821.jpg',
    title: 'Trampoline Jumping', cat: 'Sports',
    desc: 'A trampoline area where children can jump safely while staying active.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
    img: '/images/IMG_4829.jpg',
    title: 'Interactive Driving Games', cat: 'Games',
    desc: 'Ride-on vehicles with steering and control features simulating driving play.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
   img: '/images/IMG_4496.jpg',
    title: 'Outdoor Free Play Area', cat: 'Play',
    desc: 'A spacious outdoor environment for relaxation and social interaction.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
  {
    img: '/images/IMG_4833.jpg',
    title: 'Swings and Balancing', cat: 'Play',
    desc: 'Playground swings and balancing equipment that promote coordination, balance, and active play.',
    age: 'All ages', duration: 'Open play', schedule: 'All days',
  },
];

export default function ActivitiesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-slate-900 pt-40 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Activities Kids Absolutely Love</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">From high-speed go-karts to peaceful arts sessions — something exciting for every child.</p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map(a => (
              <div key={a.title}
                className="bg-white rounded-md border border-slate-100 hover:border-[#29A8C4]/30 hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 text-xs bg-slate-900 text-white font-semibold px-2.5 py-1 rounded-sm ">{a.cat}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-1.5">{a.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">{a.desc}</p>

                  <div className="flex gap-4 text-xs text-slate-700 border-t border-slate-50 pt-4 mb-4">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-700" />{a.age}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-700" />{a.duration}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-00" />{a.schedule}</span>
                  </div>

                  <Link href="/book-now"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 border border-slate-200 hover:bg-[#29A8C4] hover:border-[#29A8C4] hover:text-white text-slate-600 text-sm font-medium rounded-md transition-all duration-200">
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
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
