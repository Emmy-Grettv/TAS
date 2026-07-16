import Link from 'next/link';
import Image from 'next/image';
import { Star, CheckCircle, Calendar, Share, Users } from 'lucide-react';

export default function PartyPackagesPage() {
  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-24 pt-20">
      <div className="max-w-6xl mx-auto px-6 mt-10">
        
        {/* ── Hero Image & Overlapping Card ── */}
        <div className="relative mb-12">
          {/* Main Hero Image */}
          <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-sm">
            <Image 
              src="/images/IMG-20260714-WA0004.jpg" 
              alt="Kids birthday party at Tegano" 
              fill 
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Overlapping Info Card */}
          <div className="relative md:absolute md:bottom-[-2rem] md:left-10 md:w-[85%] bg-white rounded-2xl p-6 shadow-xl border border-slate-50 mt-[-2rem] mx-4 md:mt-0 md:mx-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">5.0</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium text-slate-500 ml-1">Voted best party venue in Harare</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Birthday &amp; Party Packages</h1>
              <p className="text-slate-500 text-sm">
                Celebrate your child's special day with an unforgettable party at Tegano Recreation Center. Full of fun, games, and memories!
              </p>
            </div>
            
            <button className="shrink-0 inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">
              <Share className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid lg:grid-cols-3 gap-12 mt-16 md:mt-24">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-14">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Our Birthday & Party packages are crafted for absolute fun and relaxation for parents. Forget complicated planning; this package includes everything you need for an amazing celebration.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                (Additional overview details to be updated soon).
              </p>
            </section>

            {/* Gallery / Highlights */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                  <Image src="/images/IMG-20260714-WA0005.jpg" alt="Activity" fill sizes="(max-width: 768px) 33vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                  <Image src="/images/IMG-20260714-WA0006.jpg" alt="Meal" fill sizes="(max-width: 768px) 33vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                  <Image src="/images/IMG-20260714-WA0007.jpg" alt="Atmosphere" fill sizes="(max-width: 768px) 33vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What's Included In Your Party Plan</h2>
              <ul className="space-y-4">
                {[
                  'Full Entrance Access for all invited kids.',
                  'Reserved Party Area for your group.',
                  'Party decorations and setup (TBD).',
                  'Party Meals & Drinks (TBD).',
                  'Dedicated party host to assist with activities.',
                  'Memorable experiences ensuring your child has the best birthday.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#fafafa] border border-slate-200 rounded-3xl p-8 sticky top-28 shadow-sm">
              <div className="flex items-end gap-1 mb-6">
                <span className="text-2xl font-extrabold text-slate-900">$TBD</span>
                <span className="text-xs font-semibold text-slate-500 mb-1">/Child</span>
              </div>

              <div className="space-y-5">
                {/* Date Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">Date of Party</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <input 
                      type="date" 
                      className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                    />
                  </div>
                </div>

                {/* Number of Children */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">Number of Guests</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <select className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all appearance-none">
                      <option>Up to 10 Kids</option>
                      <option>11 - 20 Kids</option>
                      <option>21 - 30 Kids</option>
                      <option>30+ Kids</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 mb-6 border-t border-slate-200 pt-6">
                <span className="text-sm font-bold text-slate-700">Estimated Total</span>
                <span className="text-lg font-extrabold text-slate-900">Calculated</span>
              </div>

              <Link href="/book-now" className="block w-full text-center bg-slate-900 text-white font-bold rounded-xl py-3.5 hover:bg-slate-800 transition-colors shadow-md">
                Book Party Now
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
