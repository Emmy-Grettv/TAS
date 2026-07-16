import Link from 'next/link';
import Image from 'next/image';
import { Shield, Heart, Star, Users, Eye, Zap, ArrowRight, CheckCircle, MapPin, Smile, DollarSign } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Safe and supervised environment', desc: 'Every activity is monitored closely to ensure maximum child safety.' },
  { icon: Smile, title: 'Fun for all age groups', desc: 'A wide range of engaging activities designed for toddlers to teens.' },
  { icon: Heart, title: 'Excellent customer service', desc: 'Our dedicated staff is always ready to help and ensure you have a great time.' },
  { icon: Eye, title: 'Spacious outdoor setup', desc: 'Plenty of room for children to run, play, and explore freely.' },
  { icon: DollarSign, title: 'Affordable packages', desc: 'Great value options for families, school trips, and private events.' },
  { icon: MapPin, title: 'Convenient location', desc: 'Easily accessible at 26 Princess Drive, Newlands, Harare.' },
  { icon: Star, title: 'Delicious meals available', desc: 'Quality food and refreshments to keep the energy levels high.' },
];

const team = [
  { name: 'Emmerson Chitawa', role: 'Facility Supervisor', desc: 'Over 8 years managing children\'s recreation facilities across Zimbabwe.' },
  { name: 'Tendai Moyo', role: 'Activities Coordinator', desc: 'Certified in child development and recreational therapy.' },
  { name: 'Grace Dube', role: 'Safety Officer', desc: 'First aid certified and trained in emergency response.' },
  { name: 'Tariro Ncube', role: 'Customer Relations', desc: 'Ensures every school and parent experience is seamless.' },
];

const milestones = [
  { year: '2019', event: 'Tegano Founded', detail: 'Opened our doors at 26 Princess Drive, Newlands.' },
  { year: '2020', event: '100 Schools Served', detail: 'Became the go-to school trip destination in Harare.' },
  { year: '2022', event: 'Facility Expanded', detail: 'Added new rides, water slides and creative studios.' },
  { year: '2024', event: '5-Star Rating', detail: 'Achieved the highest safety and quality rating.' },
];

const safetyFeatures = [
  'First aid certified staff on every shift',
  'CCTV monitoring across all activity zones',
  'Padded and cushioned play areas',
  'Age-appropriate activity segregation',
  'Strict capacity limits per activity',
  'Daily equipment safety inspections',
  'Emergency evacuation procedures',
  'Supervised entry and exit control',
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-slate-900 pt-20 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">About Us</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Our Story &amp; Mission</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Born from a passion to create safe, joyful spaces for Zimbabwe&apos;s children — Tegano has become Harare&apos;s most trusted destination for school trips and family outings.
          </p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">Our Beginning</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">From a Dream to Zimbabwe&apos;s Premier Recreation Center</h2>
            <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mb-6" />
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>Tegano Recreation Center is a premier kids’ recreational destination in Harare, offering a vibrant space where children can play, explore, learn, and create joyful memories.</p>
              <p>We are committed to providing:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Safe and supervised play experiences</li>
                <li>Fun outdoor and water activities</li>
                <li>Quality food and refreshments</li>
                <li>Family-friendly relaxation spaces</li>
                <li>School and corporate group packages</li>
              </ul>
              <p>Whether you are visiting with family, bringing learners for a school trip, or organizing a private event, Tegano offers an exciting experience for everyone.</p>
            </div>
          </div>
          {/* Milestone grid */}
          <div className="grid grid-cols-2 gap-4">
            {milestones.map(({ year, event, detail }) => (
              <div key={year} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="text-2xl font-bold text-[#29A8C4] mb-1">{year}</div>
                <div className="font-semibold text-slate-900 text-sm mb-1">{event}</div>
                <div className="text-slate-500 text-xs leading-snug">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-8 border border-slate-100">
            <div className="w-10 h-10 bg-[#29A8C4]/10 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-[#29A8C4]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed text-sm">To provide a safe, fun, and memorable recreation experience that promotes joy, social interaction, and learning.</p>
          </div>
          <div className="bg-white rounded-xl p-8 border border-slate-100">
            <div className="w-10 h-10 bg-[#29A8C4]/10 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-5 h-5 text-[#29A8C4]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed text-sm">To become Zimbabwe’s leading family recreation and entertainment destination.</p>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">Why Choose Us</span>
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-xl p-6 border border-transparent hover:border-[#29A8C4]/20 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 bg-[#29A8C4]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#29A8C4]" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">Our Commitment</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Safety is Our Number One Priority</h2>
            <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mb-6" />
            <div className="grid grid-cols-2 gap-3">
              {safetyFeatures.map(f => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#29A8C4] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200">
            <Image
              src="/images/recreation_center_1782114747136.png"
              alt="Tegano Recreation Center safety"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">Our People</span>
            <h2 className="text-3xl font-bold text-slate-900">Meet the Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map(m => (
              <div key={m.name} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-md transition-all duration-200">
                <div className="w-14 h-14 bg-[#29A8C4]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#29A8C4]" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-0.5">{m.name}</h4>
                <p className="text-xs text-[#29A8C4] font-medium mb-3">{m.role}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Visit Us?</h2>
          <p className="text-slate-400 mb-8">Book your school trip today and experience everything Tegano has to offer.</p>
          <Link href="/book-now"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#29A8C4] text-white font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
            Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
