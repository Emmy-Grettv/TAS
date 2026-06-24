'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';

const faqs = [
  {
    section: 'Registration',
    items: [
      { q: 'How do I book a visit for my school?', a: 'Click "Book Now", fill in your school and group details, then submit. Our team confirms your reservation within 24 hours by phone or email.' },
      { q: 'How far in advance should I book?', a: 'We recommend at least 5–7 business days in advance. For large groups (50+ children), please book 2 weeks ahead.' },
      { q: 'Can I book online?', a: 'Yes! Our online booking system is available 24/7. You can complete the entire registration in just a few minutes.' },
      { q: 'What information do I need to register?', a: 'School name, contact person, estimated number of students and teachers, preferred date, and arrival/departure times.' },
    ],
  },
  {
    section: 'Age Requirements',
    items: [
      { q: 'What age groups can visit Tegano?', a: 'We welcome children of all ages. Different activities have specific age requirements to ensure safety and appropriate fun.' },
      { q: 'Are there activities for very young children?', a: 'Yes! We have dedicated activities for toddlers — carousel, mini car rides, bouncy castles, and arts & crafts — with extra safety supervision.' },
      { q: 'What about older children?', a: 'Children up to 14 years are welcome. Go-karts, climbing wall, trampoline, water slides, and team sports are popular with older kids.' },
    ],
  },
  {
    section: 'Safety',
    items: [
      { q: "How do you ensure children's safety?", a: 'We have first aid certified staff on every shift, CCTV monitoring, padded play areas, strict capacity limits, and daily equipment safety inspections.' },
      { q: 'Is there always supervision?', a: 'Yes. All activities are supervised by trained staff at all times. Teachers and chaperones are also requested to accompany their groups.' },
      { q: 'What should children wear?', a: 'Comfortable clothes for active play. For water activities, bring extra clothes and towels. Closed-toe shoes are required for go-karts and sports.' },
    ],
  },
  {
    section: 'Fees & Payments',
    items: [
      { q: 'How much does a group visit cost?', a: 'Pricing varies by group size, activities selected, and duration. Contact us or use the booking form to get an accurate quote.' },
      { q: 'Are there group discounts?', a: 'Yes! Special rates apply for schools and groups of 20+ children. The larger the group, the better the rate.' },
      { q: 'Is a deposit required?', a: 'Yes, a 30% deposit is required to confirm your booking. The remaining balance is due on the day of your visit.' },
    ],
  },
  {
    section: 'Cancellations',
    items: [
      { q: 'What is your cancellation policy?', a: 'Cancellations more than 48 hours before the visit receive a full deposit refund. Cancellations within 48 hours may forfeit the deposit unless due to unforeseen circumstances.' },
      { q: 'Can I reschedule?', a: 'Yes, rescheduling is allowed subject to availability. Contact us early and we\'ll accommodate your new date at no extra charge.' },
      { q: 'What if it rains?', a: 'We have indoor activities. In case of severe weather, we\'ll contact you in advance to discuss rescheduling at no penalty.' },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-800 text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-[#29A8C4] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-50">
          <p className="text-slate-500 text-sm leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-slate-900 pt-20 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">FAQ</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Everything you need to know before your visit. Can&apos;t find your answer? Contact us directly.</p>
        </div>
      </section>

      {/* ── FAQ sections ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          {faqs.map(section => (
            <div key={section.section} className="mb-10">
              <h2 className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-4">{section.section}</h2>
              <div className="space-y-2">
                {section.items.map(item => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Still have questions ── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-[#29A8C4]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-[#29A8C4]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Still Have Questions?</h2>
          <p className="text-slate-500 text-sm mb-7">Our team is happy to help. Reach out and we&apos;ll respond within 24 hours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact"
              className="px-6 py-2.5 bg-[#29A8C4] text-white text-sm font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
              Contact Us
            </Link>
            <Link href="/book-now"
              className="px-6 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:border-[#29A8C4] hover:text-[#29A8C4] transition-colors flex items-center gap-2">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
