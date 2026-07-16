'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle, Loader2, AlertCircle, Shield, Phone, RefreshCw, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const steps = ['Organization', 'Contact & Visit', 'Group Details', 'Review & Submit'];

type FormData = {
  schoolName: string;
  poBox: string;
  districtArea: string;
  contactPerson: string;
  telephone: string;
  dateOfVisit: string;
  entrance: string;
  studentsCount: string;
  teachersCount: string;
  reservationsCount: string;
  arrivalTime: string;
  departureTime: string;
};

const INITIAL: FormData = {
  schoolName: '', poBox: '', districtArea: '',
  contactPerson: '', telephone: '', dateOfVisit: '', entrance: '',
  studentsCount: '', teachersCount: '', reservationsCount: '',
  arrivalTime: '', departureTime: '',
};

const entranceOptions = [
  'School package',
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold border-2 transition-all ${
              i < current ? 'bg-slate-900 text-white' :
              i === current ? 'bg-slate-900 border-white text-white' :
              'bg-white border-slate-900 text-slate-700'
            }`}>
              {i < current ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`text-sm mt-1 font-bold hidden sm:block ${i === current ? 'text-slate-900' : 'text-slate-900'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-10 sm:w-20 h-0.5 mb-4 ${i < current ? 'bg-slate-900' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-slate-900">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#29A8C4]/30 focus:border-[#29A8C4] transition-all placeholder:text-slate-300";

export default function BookNowPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          studentsCount: Number(form.studentsCount),
          reservationsCount: Number(form.reservationsCount),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Booking failed. Please try again.');
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-32">
        <div className="bg-white rounded-xl p-8 border border-slate-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#29A8C4]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#29A8C4]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Submitted</h2>
          <p className="text-slate-500 text-sm mb-2">Thank you, <span className="font-semibold text-slate-800">{form.contactPerson}</span>!</p>
          <p className="text-slate-500 text-xs leading-relaxed mb-6">Your reservation request for <strong className="text-slate-950">{form.schoolName}</strong> has been received. Our team will confirm your booking within 24 hours via phone or email.</p>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6 text-xs text-slate-600 text-left space-y-1.5">
            <p><span className="font-medium text-slate-500">Date:</span> {new Date(form.dateOfVisit).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><span className="font-medium text-slate-500">Students:</span> {form.studentsCount}</p>
            <p><span className="font-medium text-slate-500">Package:</span> {form.entrance}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-full py-2.5 bg-[#29A8C4] text-white font-semibold text-sm rounded-lg hover:bg-[#1e8fa8] transition-colors">
              Back to Home
            </Link>
            <button onClick={() => { setSuccess(false); setForm(INITIAL); setStep(0); }}
              className="w-full py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:border-[#29A8C4] hover:text-[#29A8C4] transition-colors">
              Make Another Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 pt-20 pb-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Book Your Visit</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Complete the form below and our team will confirm your reservation within 24 hours.</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <StepIndicator current={step} />

          <div className="bg-white rounded-xl p-8 border border-slate-100">
            {/* Step 1 – Organization */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-md text-slate-900">Organization Details</h2>
                  <p className="text-slate-800 text-sm mt-0.5">Tell us about the school or organization visiting us.</p>
                  <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mt-3" />
                </div>
                <Field label="School / Organization Name" required>
                  <input required value={form.schoolName} onChange={set('schoolName')} className={inputCls} placeholder="e.g. Borrowdale Primary School" />
                </Field>
                <Field label="District / Area" required>
                  <input required value={form.districtArea} onChange={set('districtArea')} className={inputCls} placeholder="e.g. Harare North" />
                </Field>
                <Field label="PO Box (optional)">
                  <input value={form.poBox} onChange={set('poBox')} className={inputCls} placeholder="e.g. PO Box 1234, Harare" />
                </Field>
              </div>
            )}

            {/* Step 2 – Contact & Visit */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Contact & Visit Details</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Who should we contact, and when are you planning to visit?</p>
                  <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mt-3" />
                </div>
                <Field label="Contact Person" required>
                  <input required value={form.contactPerson} onChange={set('contactPerson')} className={inputCls} placeholder="Full name of coordinator" />
                </Field>
                <Field label="Phone Number" required>
                  <input required value={form.telephone} onChange={set('telephone')} className={inputCls} placeholder="+263 XXX XXX XXX" />
                </Field>
                <Field label="Preferred Date of Visit" required>
                  <input required type="date" value={form.dateOfVisit} onChange={set('dateOfVisit')} className={inputCls}
                    min={new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]} />
                </Field>
                <Field label="Entrance / Package" required>
                  <select required value={form.entrance} onChange={set('entrance')} className={inputCls}>
                    <option value="">Select a package…</option>
                    {entranceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {/* Step 3 – Group Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Group Details</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Help us prepare by sharing the size and schedule of your group.</p>
                  <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mt-3" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Number of Students" required>
                    <input required type="number" min="1" value={form.studentsCount} onChange={set('studentsCount')} className={inputCls} placeholder="e.g. 45" />
                  </Field>
                  <Field label="Number of Teachers">
                    <input type="number" min="0" value={form.teachersCount} onChange={set('teachersCount')} className={inputCls} placeholder="e.g. 3" />
                  </Field>
                </div>
                <Field label="Reservations Count" required>
                  <input required type="number" min="1" value={form.reservationsCount} onChange={set('reservationsCount')} className={inputCls} placeholder="Total reservations needed" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Arrival Time">
                    <input type="time" value={form.arrivalTime} onChange={set('arrivalTime')} className={inputCls} />
                  </Field>
                  <Field label="Departure Time">
                    <input type="time" value={form.departureTime} onChange={set('departureTime')} className={inputCls} />
                  </Field>
                </div>
              </div>
            )}

            {/* Step 4 – Review */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Review Your Booking</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Please confirm all details before submitting.</p>
                  <div className="w-10 h-0.5 bg-[#29A8C4] rounded-full mt-3" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 space-y-2.5 text-xs">
                  {[
                    ['School / Organization', form.schoolName],
                    ['District / Area', form.districtArea],
                    ['PO Box', form.poBox || '—'],
                    ['Contact Person', form.contactPerson],
                    ['Phone', form.telephone],
                    ['Date of Visit', form.dateOfVisit ? new Date(form.dateOfVisit).toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : '—'],
                    ['Package', form.entrance],
                    ['Number of Students', form.studentsCount],
                    ['Number of Teachers', form.teachersCount || '—'],
                    ['Reservations', form.reservationsCount],
                    ['Arrival Time', form.arrivalTime || '—'],
                    ['Departure Time', form.departureTime || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-500 font-medium">{k}</span>
                      <span className="text-slate-800 font-semibold text-right">{v}</span>
                    </div>
                  ))}
                </div>
                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-xs text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="bg-[#29A8C4]/5 border border-[#29A8C4]/20 rounded-lg p-4 text-xs text-slate-600 flex gap-2.5 items-start">
                  <CheckCircle className="w-4 h-4 text-[#29A8C4] shrink-0 mt-0.5" />
                  <span>By submitting, you agree that our team will contact you to confirm this booking within 24 hours.</span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <button onClick={prev} disabled={step === 0}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm disabled:opacity-30 hover:border-[#29A8C4] hover:text-[#29A8C4] transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {step < 3 ? (
                <button onClick={next}
                  className="px-5 py-2.5 rounded-md bg-[#29A8C4] text-white font-semibold text-sm hover:bg-[#1e8fa8] transition-colors flex items-center gap-2">
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={submit} disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-[#29A8C4] text-white font-semibold text-sm hover:bg-[#1e8fa8] transition-colors flex items-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Submit Booking</>}
                </button>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Shield, label: 'Secure Submission' },
              { icon: Phone, label: '24hr Confirmation' },
              { icon: RefreshCw, label: 'No Payment Online' },
              { icon: Calendar, label: 'Free to Register' }
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-[#29A8C4]" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
