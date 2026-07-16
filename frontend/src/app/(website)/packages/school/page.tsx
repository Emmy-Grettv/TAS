'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Star, CheckCircle, Share, Users } from 'lucide-react';

export default function SchoolPackagesPage() {
  const [children, setChildren] = useState<number | ''>('');
  const PRICE_PER_CHILD = 12;
  const total = children !== '' && children > 0 ? children * PRICE_PER_CHILD : null;

  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-24">
      
      {/* ── Full-Width Hero ── */}
      <div className="relative w-full h-[450px]">
        <Image 
          src="/images/IMG_6575.jpg" 
          alt="School field trip at Tegano" 
          fill 
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dark overlay ensures header is visible */}
        <div className="absolute inset-0 bg-slate-900/30" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        
        {/* Overlapping Info Card */}
        <div className="bg-white rounded-md p-6 shadow-xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">5.0</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-slate-500 ml-1">Rated highly by local schools</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">School Visits &amp; Group Packages</h1>
            <p className="text-slate-500 text-sm">
              Bring your learners for a fun-filled educational and recreational experience. We welcome Schools, Daycare Centers, Holiday Clubs, and Youth Groups.
            </p>
          </div>
          
          {/* <button className="shrink-0 inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
            <Share className="w-4 h-4" /> Share
          </button> */}
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid lg:grid-cols-3 gap-12 mt-16 md:mt-24">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-14">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Bring your learners for a fun-filled educational and recreational experience.
              </p>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Package Includes</h2>
              <ul className="space-y-4">
                {[
                  'Full Entrance Access',
                  'Recreational Activities',
                  'Meal',
                  'Drink'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-slate-600 font-semibold">•  {item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Meal Options */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Meal Options</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Option 1:</h3>
                  <ul className="space-y-2">
                    <li className="text-slate-600 text-sm font-medium">• 2 Pieces Chicken</li>
                    <li className="text-slate-600 text-sm font-medium">• Chips</li>
                    <li className="text-slate-600 text-sm font-medium">• Drink</li>
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">Option 2:</h3>
                  <ul className="space-y-2">
                    <li className="text-slate-600 text-sm font-medium">• Beef Burger</li>
                    <li className="text-slate-600 text-sm font-medium">• Chips</li>
                    <li className="text-slate-600 text-sm font-medium">• Drink</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* We Welcome & Benefits */}
            <section className="grid sm:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">We Welcome</h2>
                <ul className="space-y-3">
                  {['Schools', 'Daycare Centers', 'Holiday Clubs', 'Youth Groups'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-slate-600">•  {item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Benefits for Schools</h2>
                <ul className="space-y-3">
                  {['Safe environment', 'Group supervision', 'Team-building activities', 'Memorable experiences'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-slate-600">•  {item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#fafafa] border border-slate-200 rounded-md p-8 sticky top-28 shadow-sm">
              <div className="flex items-end gap-1 mb-6">
                <span className="text-2xl font-extrabold text-slate-900">$12.00</span>
                <span className="text-xs font-semibold text-slate-500 mb-1">/Child</span>
              </div>

              <div className="space-y-5">
                {/* Number of Students */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">Number of Students</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      min={1}
                      placeholder="e.g. 35"
                      value={children}
                      onChange={e => setChildren(e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-md pl-10 pr-4 py-3 focus:outline-none focus:border-[#29A8C4] focus:ring-1 focus:ring-[#29A8C4] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 mb-6 border-t border-slate-200 pt-6">
                <span className="text-sm font-bold text-slate-700">Total</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {total !== null ? `$${total.toFixed(2)} USD` : '—'}
                </span>
              </div>

              <Link href="/book-now" className="block w-full text-center bg-slate-900 text-white font-bold rounded-md py-3.5 hover:bg-slate-800 transition-colors shadow-md">
                Book Now
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
