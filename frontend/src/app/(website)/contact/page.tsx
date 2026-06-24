'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight } from 'lucide-react';

const contactInfo = [
  { icon: Phone, title: 'Phone', lines: ['+263 781 499 656', '+263 784 700 878'], href: 'tel:+263781499656' },
  { icon: Mail, title: 'Email', lines: ['teganoinvestmentpvtltd@gmail.com'], href: 'mailto:teganoinvestmentpvtltd@gmail.com' },
  { icon: MapPin, title: 'Address', lines: ['26 Princess Drive, Newlands', 'Harare, Zimbabwe'], href: '#' },
  { icon: Clock, title: 'Hours', lines: ['Mon–Fri: 08:00–17:00', 'Sat: 08:00–16:00', 'Sun: 09:00–14:00'], href: '#' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-slate-900 pt-20 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold text-[#29A8C4] uppercase tracking-widest mb-3 block">Contact</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">We&apos;d love to hear from you. Send a message and we&apos;ll get back to you within 24 hours.</p>
        </div>
      </section>

      {/* ── Contact cards ── */}
      <section className="py-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map(({ icon: Icon, title, lines, href }) => (
              <a key={title} href={href}
                className="bg-white rounded-xl p-5 border border-slate-100 hover:border-[#29A8C4]/30 hover:shadow-sm transition-all duration-200 group block">
                <div className="w-10 h-10 bg-[#29A8C4]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#29A8C4]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#29A8C4]" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1.5">{title}</h4>
                {lines.map((l, i) => <p key={i} className="text-slate-500 text-xs leading-relaxed">{l}</p>)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Send Us a Message</h2>
            <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mb-7" />

            {sent ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
                <CheckCircle className="w-12 h-12 text-[#29A8C4] mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm mb-6">Thank you — we&apos;ll respond within 24 hours.</p>
                <button onClick={() => setSent(false)}
                  className="px-5 py-2 bg-[#29A8C4] text-white text-sm font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A8C4]/30 focus:border-[#29A8C4] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A8C4]/30 focus:border-[#29A8C4] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+263 XXX XXX XXX"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A8C4]/30 focus:border-[#29A8C4] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject *</label>
                  <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A8C4]/30 focus:border-[#29A8C4] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more..."
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A8C4]/30 focus:border-[#29A8C4] transition-all resize-none" />
                </div>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#29A8C4] text-white font-semibold text-sm rounded-lg hover:bg-[#1e8fa8] transition-colors">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Map + quick contact */}
          <div className="space-y-5">
            {/* Map placeholder */}
            <div className="bg-slate-50 rounded-xl h-64 flex flex-col items-center justify-center border border-slate-100">
              <MapPin className="w-8 h-8 text-[#29A8C4] mb-2" />
              <p className="font-semibold text-slate-800">26 Princess Drive</p>
              <p className="text-slate-500 text-sm mb-4">Newlands, Harare, Zimbabwe</p>
              <a href="https://maps.google.com/?q=Newlands+Harare+Zimbabwe" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2 bg-[#29A8C4] text-white text-sm font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
                Open in Google Maps
              </a>
            </div>

            {/* Quick contact card */}
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <h3 className="font-bold text-white mb-4">Quick Contact</h3>
              <div className="space-y-3 mb-5">
                <a href="tel:+263781499656" className="flex items-center gap-3 text-slate-300 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-[#29A8C4]" /> +263 781 499 656
                </a>
                <a href="tel:+263784700878" className="flex items-center gap-3 text-slate-300 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-[#29A8C4]" /> +263 784 700 878
                </a>
                <a href="mailto:teganoinvestmentpvtltd@gmail.com" className="flex items-center gap-3 text-slate-300 hover:text-white text-xs transition-colors">
                  <Mail className="w-4 h-4 text-[#29A8C4]" /> teganoinvestmentpvtltd@gmail.com
                </a>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-slate-400 text-xs mb-3">Prefer to book directly?</p>
                <Link href="/book-now"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#29A8C4] text-white text-sm font-semibold rounded-lg hover:bg-[#1e8fa8] transition-colors">
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
