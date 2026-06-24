import Link from 'next/link';
import Image from 'next/image';
import { Shield, Users, Star, ArrowRight, MapPin, Clock, CheckCircle } from 'lucide-react';

const activities = [
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
    title: 'Go-Kart Racing',
    desc: 'Mini electric go-karts on a safe, professionally designed track.',
  },
  {
    img: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&q=80&w=600',
    title: 'Water Activities',
    desc: 'Splash pools, water slides and inflatable water fun.',
  },
  {
    img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600',
    title: 'Bouncy Castles',
    desc: 'Giant inflatables for jumping, bouncing and play.',
  },
  {
    img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600',
    title: 'Arts & Crafts',
    desc: 'Creative painting, clay and DIY craft sessions.',
  },
  {
    img: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&q=80&w=600',
    title: 'Carousel Rides',
    desc: 'Colourful carousel rides loved by children of all ages.',
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
    title: 'Sports & Games',
    desc: 'Team sports, relay races and outdoor group games.',
  },
];

const whyUs = [
  { icon: Shield, title: 'Safety First', desc: 'First aid certified staff, CCTV coverage, and padded activity zones at all times.' },
  { icon: Users, title: 'All Ages Welcome', desc: 'Dedicated play zones for toddlers through to 14-year-olds.' },
  { icon: Star, title: 'Trusted by Schools', desc: 'Over 100 Harare schools choose Tegano for school trips every year.' },
];

const safetyPoints = [
  'First aid certified staff on every shift',
  'CCTV monitoring across all zones',
  'Padded and cushioned play areas',
  'Age-appropriate activity segregation',
  'Daily equipment safety inspections',
  'Supervised entry and exit control',
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-slate-900 pt-20 pb-0 lg:pt-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-end">
          <div className="pb-20 lg:pb-28 pt-8">
            <span className="inline-block text-[#29A8C4] text-sm font-semibold mb-4 tracking-wide">
              Harare&apos;s Premier Children&apos;s Recreation Center
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-5">
              Fun, Safe &amp;<br />
              <span className="text-[#29A8C4]">Unforgettable</span><br />
              Play Experiences
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
              Professionally supervised activities for children of all ages, right here in Newlands, Harare.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book-now"
                className="px-6 py-3 bg-[#29A8C4] text-white font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors flex items-center gap-2">
                Book Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/activities"
                className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/8 hover:border-white/40 transition-all duration-200">
                See Activities
              </Link>
            </div>
          </div>

          {/* Right — hero image flush to bottom */}
          <div className="hidden lg:block self-end">
            <Image
              src="/images/kids_playing_hero_1782114683766.png"
              alt="Children playing at Tegano Recreation Center"
              width={580}
              height={500}
              className="w-full object-cover object-top rounded-t-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Quick stats strip ── */}
      <section className="bg-[#29A8C4]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-white text-sm font-medium">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 opacity-70" /> 26 Princess Drive, Newlands</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 opacity-70" /> Mon–Sat from 08:00</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 opacity-70" /> School trips welcome</span>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
            <Image
              src="/images/kids_about_us_1782114726225.png"
              alt="Staff with children at Tegano"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">About Tegano</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
              More Than Just a Playground
            </h2>
            <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mb-5" />
            <p className="text-slate-600 leading-relaxed mb-4">
              Tegano Recreation Center is an indoor playground in Newlands, Harare. We host daily activities and school trips in a secure, professionally managed environment.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8">
              Our activities are designed to build social skills, keep kids physically active, and spark creativity — all while having the time of their lives.
            </p>
            <div className="flex gap-10">
              {[['500+', 'Monthly visitors'], ['12+', 'Activities'], ['100%', 'Safe']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-[#29A8C4]">{v}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Activities grid ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">What We Offer</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Activities Kids Love</h2>
          </div>
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
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-1.5">{a.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/activities"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-[#29A8C4] hover:text-[#29A8C4] transition-all duration-200">
              View all activities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">Why Parents Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Built for Happy, Safe Kids</h2>
            <div className="space-y-6 mb-8">
              {whyUs.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-[#29A8C4]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#29A8C4]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about"
              className="inline-flex items-center gap-2 text-[#29A8C4] text-sm font-semibold hover:underline">
              Learn more about us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
              <Image
                src="/images/recreation_center_1782114747136.png"
                alt="Tegano Recreation Center facility"
                fill
                className="object-cover"
              />
            </div>
            {/* Safety checklist */}
            <div className="mt-5 bg-slate-50 rounded-xl p-5 border border-slate-100">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3">Our Safety Commitments</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {safetyPoints.map(p => (
                  <div key={p} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-[#29A8C4] shrink-0 mt-0.5" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Book a Visit?</h2>
          <p className="text-slate-400 mb-8">Group rates available. Schools and community groups are very welcome.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/book-now"
              className="px-7 py-3 bg-[#29A8C4] text-white font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors flex items-center gap-2">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact"
              className="px-7 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/8 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
