'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Check,
  Calendar,
  BookOpen,
  Quote,
  Shield,
  Smile,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sun
} from 'lucide-react';

const activities = [
  {
    img: '/images/IMG_4256.JPG',
    title: 'Electric Go-Kart Racing',
    age: 'All ages',
    desc: 'Students drive mini electric go-karts on a safe track designed for children.',
  },
  {
    img: '/images/IMG_4214.jpg',
    title: 'Mini Electric Car & Motorcycle Rides',
    age: 'All ages',
    desc: 'Children ride battery-powered cars and motorcycles in a supervised driving area.',
  },
  {
    img: '/images/IMG_4827.jpg',
    title: 'Carousel Rotating Ride',
    age: 'All ages',
    desc: 'A gentle rotating ride with colorful vehicles designed for younger children.',
  },
  {
    img: '/images/IMG_4219.jpg',
    title: 'Inflatable Bouncy Castles',
    age: 'All ages',
    desc: 'Large inflatable castles where children can jump and bounce safely.',
  },
  {
    img: '/images/IMG_4214.jpg',
    title: 'Inflatable Adventure Play Structures',
    age: 'All ages',
    desc: 'Inflatable play zones with climbing, sliding, and jumping sections.',
  },
  {
    img: '/images/IMG_4346.jpg',
    title: 'Water Splash Pool Play',
    age: 'All ages',
    desc: 'A shallow splash pool where children can enjoy safe water play.',
  },
  {
    img: '/images/IMG_4342.jpg',
    title: 'Inflatable Water Slides',
    age: 'All ages',
    desc: 'Inflatable slides allowing children to climb and slide into the splash pool.',
  },
  {
    img: '/images/IMG_4262.JPG',
    title: 'Inflatable Water Climbing Wall',
    age: 'All ages',
    desc: 'A soft inflatable climbing wall placed in the pool for balance and fun.',
  },
  {
    img: '/images/IMG_4821.jpg',
    title: 'Trampoline Jumping',
    age: 'All ages',
    desc: 'A trampoline area where children can jump safely while staying active.',
  },
  {
    img: '/images/IMG_4829.jpg',
    title: 'Interactive Driving Games',
    age: 'All ages',
    desc: 'Ride-on vehicles with steering and control features simulating driving play.',
  },
  {
    img: '/images/IMG_4496.jpg',
    title: 'Outdoor Free Play Area',
    age: 'All ages',
    desc: 'A spacious outdoor environment for relaxation and social interaction.',
  },
  {
    img: '/images/IMG_4833.jpg',
    title: 'Swings and Balancing',
    age: 'All ages',
    desc: 'Playground swings and balancing equipment that promote coordination, balance, and active play.',
  },
];

const safetyFeatures = [
  {
    title: 'First Aid Certified Staff',
    desc: 'Qualified supervisors are always active on the floor to guarantee children’s safety.',
  },
  {
    title: 'Full CCTV Coverage',
    desc: 'Continuous real-time surveillance across all indoor and outdoor activity areas.',
  },
  {
    title: 'Padded Activity Zones',
    desc: 'High-density safety padding, safety netting, and cushioned ground surfaces.',
  },
];

const blogPosts = [
  {
    title: 'Tips for Planning the Perfect Kids Birthday Party',
    category: 'Guide',
    date: 'July 12, 2026',
    readTime: '5 min read',
    img: '/images/IMG-20260714-WA0004.jpg',
  },
  {
    title: 'Why Active Play is Crucial for Early Childhood Development',
    category: 'Health',
    date: 'July 05, 2026',
    readTime: '8 min read',
    img: '/images/IMG-20260714-WA0005.jpg',
  },
  {
    title: 'Safety Tips for Kids Swimming and Splash Pools',
    category: 'Safety',
    date: 'June 28, 2026',
    readTime: '6 min read',
    img: '/images/IMG-20260714-WA0006.jpg',
  },
];

export default function HomePage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const heroBgs = [
    '/images/IMG_4833.jpg',
    '/images/IMG_4753.jpg',
    '/images/IMG_4342.jpg'
  ];

  const [bgIndex, setBgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'stats' | 'rating' | 'facilities'>('stats');

  const nextBg = () => setBgIndex((prev) => (prev + 1) % heroBgs.length);
  const prevBg = () => setBgIndex((prev) => (prev - 1 + heroBgs.length) % heroBgs.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroBgs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBgs.length]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', subject: '', message: '' });
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <>
      {/* ── Section 1: HERO ── */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-32 lg:pt-32 overflow-hidden bg-slate-950">
        
        {/* Background Images Slider */}
        {heroBgs.map((bg, idx) => (
          <div
            key={bg}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
              idx === bgIndex ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full flex flex-col justify-between h-full">
          
          {/* Top Row: Info & Weather & Arrows */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pt-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                3 Play Zones • 1 Restaurant • 12+ Activities
              </span>
              <div className="flex items-center gap-2 text-slate-300 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] sm:text-xs font-bold">24°C Sunny &amp; Warm</span>
              </div> */}
            </div>

            {/* Slider Navigation Circles */}
            <div className="flex gap-2">
              <button
                onClick={prevBg}
                className="w-10 h-10 rounded-full border border-white/20 bg-slate-950/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-950 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextBg}
                className="w-10 h-10 rounded-full border border-white/20 bg-slate-950/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-950 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Middle Row: Content */}
          <div className="max-w-3xl mb-16 fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-none tracking-tight mb-6">
              Where Kids, Fun, Adventure &amp; Smiles Come Together
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              At Tegano Recreation Center, we create unforgettable experiences for children, families, schools, and groups through exciting activities and safe outdoor play.
            </p>
          </div>

        </div>
      </section>

      {/* ── Overlay Stats Bar (straddles hero / activities boundary) ── */}
      <div className="relative z-20 -mt-25">
        <div className="max-w-6xl mx-auto px-6">

          {/* Tabs sit above the card, overlapping into the hero dark area */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-t-md text-xs transition-all cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-slate-800/90 backdrop-blur-sm text-slate-300 hover:text-white'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-[#29A8C4]" />
              <span>Overview</span>
            </button>
            {/* <button
              onClick={() => setActiveTab('rating')}
              className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-t-xl text-xs transition-all cursor-pointer ${
                activeTab === 'rating'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-slate-800/90 backdrop-blur-sm text-slate-300 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[#29A8C4]" />
              <span>Rating</span>
            </button> */}
            <button
              onClick={() => setActiveTab('facilities')}
              className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-t-md text-xs transition-all cursor-pointer ${
                activeTab === 'facilities'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-slate-800/90 backdrop-blur-sm text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#29A8C4]" />
              <span>Facilities</span>
            </button>
          </div>

          {/* White card — top half over dark hero, bottom half over white section */}
          <div className="bg-white rounded-b-2xl rounded-tr-2xl p-6 shadow-2xl border border-slate-100 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:pr-52">
              {activeTab === 'stats' && (
                <>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</span>
                    <span className="text-lg font-bold text-slate-800">Harare</span>
                    <span className="text-xs text-slate-500 mt-1">26 Princess Dr, Newlands</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Visitors</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-slate-800">500+</span>
                      <span className="text-xs text-slate-500 font-semibold">Happy Kids</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">Families &amp; Schools</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Safety Standard</span>
                    <span className="text-lg font-bold text-slate-800">100% Certified</span>
                    <span className="text-xs text-slate-500 mt-1">First-Aid Staff Onsite</span>
                  </div>
                </>
              )}
              {activeTab === 'rating' && (
                <>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Google Reviews</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-bold text-slate-800">4.9</span>
                      <div className="flex text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">150+ Verified Ratings</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommendation</span>
                    <span className="text-lg font-bold text-slate-800">100% Love</span>
                    <span className="text-xs text-slate-500 mt-1">By Parents &amp; Teachers</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Awards</span>
                    <span className="text-lg font-bold text-slate-800">Top Choice</span>
                    <span className="text-xs text-slate-500 mt-1">Best Family Fun 2026</span>
                  </div>
                </>
              )}
              {activeTab === 'facilities' && (
                <>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Play Zones</span>
                    <span className="text-lg font-bold text-slate-800">12+ Activities</span>
                    <span className="text-xs text-slate-500 mt-1">Go-Karts, Water Slides &amp; More</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dining</span>
                    <span className="text-lg font-bold text-slate-800">Restaurant</span>
                    <span className="text-xs text-slate-500 mt-1">Tasty Meals &amp; Refreshments</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Opening Hours</span>
                    <span className="text-lg font-bold text-slate-800">10AM – 5PM</span>
                    <span className="text-xs text-slate-500 mt-1">Open Daily</span>
                  </div>
                </>
              )}
            </div>

            {/* Book Now button offset to the right */}
            <div className="mt-4 md:mt-0 md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2">
              <Link
                href="/book-now"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white font-extrabold rounded-md hover:bg-slate-800 transition-all duration-200 shadow-lg whitespace-nowrap"
              >
                <span>Book Now</span>
                <ArrowRight className="w-5 h-5 text-[#29A8C4]" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Section 3: COMPREHENSIVE PLAY SOLUTIONS (Activities) ── */}
      <section className="pt-16 pb-24 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header-split mb-16">
            <div>
              <span className="section-eyebrow">Services and Play</span>
              <h2 className="section-title-premium">
                Comprehensive <em>Play</em> Solutions
              </h2>
            </div>
            <div>
              <p className="section-description mb-4 md:mb-0">
                Professional recreation environments custom built for school field trips, weekend outings, and memorable birthday parties in Newlands.
              </p>
            </div>
          </div>

          <div className="activities-grid-premium">
            {/* Featured Left Card */}
            <div className="activity-card-large relative">
              <Image
                src="/images/IMG_4257.JPG"
                alt="Go-Kart racing track"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="activity-card-large-content">
                <span className="inline-block bg-[#0077b6] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">Featured Activity</span>
                <h3 className="text-2xl font-extrabold text-white mb-2">Go-Kart Pro-Track</h3>
                <p className="text-white/80 text-sm max-w-sm mb-4">
                  Electric, high-safety mini go-karts perfect for school races, building reflexes and learning track rules.
                </p>
                <Link href="/book-now" className="inline-flex items-center gap-2 text-white font-bold hover:text-accent-teal transition-colors">
                  Book slots now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Subgrid Right Card */}
            <div className="activity-subgrid">
              {activities.slice(1, 5).map((act) => (
                <div key={act.title} className="activity-card-premium">
                  <div className="activity-card-img">
                    <img
                      src={act.img}
                      alt={act.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="activity-badge">{act.age}</span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-slate-900 mb-1.5">{act.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4">{act.desc}</p>
                    <Link href="/activities" className="inline-flex items-center gap-1.5 text-xs font-bold text-electric-blue hover:text-accent-teal transition-colors">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/activities" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
              View All Activities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: SAFETY FEATURE CHECKLIST ── */}
      <section id="safety" className="dark-feature-section py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Asymmetric Left Image */}
          <div className="relative aspect-square w-full max-w-[440px] mx-auto">
            <div className="asymmetric-image-container w-full h-full relative">
              <Image
                src="/images/IMG_6574.jpg"
                alt="Play facility check"
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Checklist */}
          <div>
            <span className="section-eyebrow text-accent-teal">Safety &amp; Care</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">
              Over 10 Years of Safety-First Play Experiences
            </h2>
            <p className="text-white/70 mb-10 text-sm">
              We understand that peace of mind is paramount. That is why all our equipment is tested daily and certified to international protection standards.
            </p>

            <div className="space-y-4">
              {safetyFeatures.map((feat) => (
                <div key={feat.title} className="feature-dark-card">
                  <div className="feature-check-icon">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base mb-1">{feat.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: ABOUT, MISSION & VISION ── */}
      <section id="about" className="light-stats-section py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-eyebrow">About Tegano</span>
            <h2 className="section-title-premium mb-6">
              A Premier Kids' <em>Recreational</em> Destination
            </h2>
            <div className="text-slate-600 mb-10 text-sm leading-relaxed space-y-4">
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

            <div className="space-y-6">
              <div className="commitment-stat-box">
                <h4 className="font-extrabold text-slate-900 text-lg">Mission</h4>
                <p className="text-slate-500 text-sm mt-1">To provide a safe, fun, and memorable recreation experience that promotes joy, social interaction, and learning.</p>
              </div>
              <div className="commitment-stat-box">
                <h4 className="font-extrabold text-slate-900 text-lg">Vision</h4>
                <p className="text-slate-500 text-sm mt-1">To become Zimbabwe’s leading family recreation and entertainment destination.</p>
              </div>
            </div>
          </div>

          {/* Overlapping Collage */}
          <div className="commitment-collage relative">
            <div className="collage-img-1">
              <Image
                src="/images/IMG_6583.jpg"
                alt="Kid drawing"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="collage-img-2">
              <Image
                src="/images/IMG_6581.jpg"
                alt="Kid in go-kart"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: TESTIMONIALS REMOVED ── */}

      {/* ── Section 7: WHY CHOOSE US ── */}
      <section className="spotlight-section py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Image */}
          <div className="relative aspect-square w-full max-w-[440px] mx-auto rounded.md overflow-hidden shadow-2xl">
            <Image
              src="/images/IMG_6576.jpg"
              alt="Why Choose Us"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Right Text */}
          <div>
            <span className="section-eyebrow">Why Choose Us</span>
            <h2 className="section-title-premium mb-6">Experience the Best in Kids' Recreation</h2>
            <p className="text-slate-600 mb-10 text-sm">
              We are dedicated to providing the best experience for you and your children. Here is why families and schools trust us.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Safe environment', icon: Shield },
                { title: 'Supervised activities', icon: Users },
                { title: 'Fun for schools and families', icon: Smile },
                { title: 'Spacious outdoor area', icon: MapPin },
                { title: 'Meals available', icon: Star },
                { title: 'Easy booking', icon: CheckCircle },
              ].map((feat) => (
                <div key={feat.title} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#0077b6]/10 flex items-center justify-center text-[#0077b6] shrink-0">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{feat.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: LATEST ARTICLES ── */}
      {/* <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="section-eyebrow">Knowledge</span>
              <h2 className="section-title-premium">Latest Articles</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-electric-blue hover:text-accent-teal transition-all">
              See All Posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="blog-grid-premium">
            {blogPosts.map((post) => (
              <div key={post.title} className="blog-card-premium">
                <div className="blog-card-img">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                  <span className="blog-card-badge">{post.category}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-meta">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.date}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug mb-3 hover:text-electric-blue transition-colors">
                    <a href="#">{post.title}</a>
                  </h4>
                  <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-electric-blue hover:text-accent-teal transition-colors">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Section 9: PREMIUM CONTACT FORM ── */}
      <section id="contact" className="premium-contact-section py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="contact-card-premium grid lg:grid-cols-2 gap-16 relative z-10">

            {/* Left Contact Info */}
            <div className="flex flex-col justify-between ">
              <div>
                <span className="text-white">Get In Touch</span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">
                  Ready to Plan Your Visit?
                </h2>
                <p className="text-white/70 mb-10 text-sm">
                  Whether it is a birthday party, school trip, or general enquiry, fill in the form and our booking team will be in touch within 24 hours.
                </p>

                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-icon-circle">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">Location</h5>
                      <p className="text-white/60 text-xs">26 Princess Drive, Newlands, Harare</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-circle">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">Phone Support</h5>
                      <p className="text-white/60 text-xs">+263 781 499 656 / +263 784 700 878</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-icon-circle">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">Email Address</h5>
                      <p className="text-white/60 text-xs">teganoinvestmentpvtltd@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 mt-10">
                <span className="text-[0.7rem] font-bold text-white/40 tracking-widest uppercase">Opening Hours</span>
                <div className="mt-2 text-xs text-white/60">
                  <span>Open Daily: 10:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div>
              {formSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center text-white h-full flex flex-col justify-center items-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="font-bold text-lg mb-2">Message Sent Successfully!</h4>
                  <p className="text-xs text-white/60">Thank you for writing. Our team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="contact-form-premium">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-group-premium">
                      <label className="form-label-premium">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="form-input-premium"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group-premium">
                      <label className="form-label-premium">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="form-input-premium"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group-premium">
                    <label className="form-label-premium">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Birthday Party Enquiry"
                      className="form-input-premium"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group-premium">
                    <label className="form-label-premium">Message</label>
                    <textarea
                      required
                      placeholder="Write your message here..."
                      className="form-input-premium form-textarea-premium"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="form-submit-btn-premium mt-2">
                    Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
