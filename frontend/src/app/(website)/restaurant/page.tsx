import Link from 'next/link';
import Image from 'next/image';
import { ChefHat } from 'lucide-react';

export default function RestaurantPage() {
  const menuCategories = [
    {
      title: 'Meals',
      icon: '🍽️',
      items: ['Chicken & Chips', 'Beef Burger & Chips', 'Kids Special Combos', 'Group Meals'],
    },
    {
      title: 'Snacks',
      icon: '🥨',
      items: ['Assorted Snacks', 'French Fries', 'Spring Rolls', 'Mini Pies'],
    },
    {
      title: 'Drinks & Refreshments',
      icon: '🥤',
      items: ['Soft Drinks', 'Fruit Juices', 'Water', 'Ice Cream'],
    },
  ];

  return (
    <div className="bg-white min-h-screen">

      {/* ── About Section ── */}
      <section className="pt-28 pb-20 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left – Styled Photo Collage */}
          <div className="relative h-[500px]">
            {/* Main large image - bottom left */}
            <div className="absolute bottom-0 left-0 w-[58%] h-[75%] rounded-md overflow-hidden shadow-xl border-4 border-white z-10">
              <Image
                src="/images/IMG-20260714-WA0006.jpg"
                alt="Tegano Restaurant"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            {/* Top right image - elevated */}
            <div className="absolute top-0 right-0 w-[48%] h-[52%] rounded-md overflow-hidden shadow-xl border-4 border-white z-20 rotate-2">
              <Image
                src="/images/IMG_6572.jpg"
                alt="Tegano Food"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            {/* Bottom right image - overlapping */}
            <div className="absolute bottom-0 right-0 w-[44%] h-[44%] rounded-md overflow-hidden shadow-xl border-4 border-white z-30 -rotate-1">
              <Image
                src="/images/IMG-20260714-WA0005.jpg"
                alt="Tegano Meals"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            {/* Decorative teal dot pattern */}
            <div className="absolute top-4 left-4 w-20 h-20 opacity-20 z-0"
              style={{ backgroundImage: 'radial-gradient(#29A8C4 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }}
            />
            <div className="absolute bottom-4 right-4 w-20 h-20 opacity-20 z-0"
              style={{ backgroundImage: 'radial-gradient(#29A8C4 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }}
            />
          </div>

          {/* Right – Content */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="w-5 h-5 text-[#29A8C4]" />
              <span className="text-sm font-semibold italic text-[#29A8C4]">About our restaurant</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
              Food &amp; Refreshments
            </h1>
            <p className="text-slate-500 text-lg mb-6 leading-relaxed">
              Our restaurant serves delicious meals and refreshments for children, parents, and visitors.
            </p>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Enjoy quality meals while relaxing in our comfortable dining spaces. Whether you&apos;re here with family, a school group, or for a birthday party — we have something for everyone.
            </p>
            {/* <div className="flex flex-wrap gap-4">
              <Link
                href="/book-now"
                className="px-7 py-3 bg-[#0077b6] text-white font-bold rounded-full hover:bg-[#005f99] transition-colors shadow-md"
              >
                Book a Table
              </Link>
              <a
                href="#menu"
                className="px-7 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-full hover:border-[#29A8C4] hover:text-[#29A8C4] transition-colors"
              >
                View Menu
              </a>
            </div> */}
          </div>

        </div>
      </section>

      {/* ── Menu Category Cards (dark navy section) ── */}
      <section className="bg-[#0a1931] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#29A8C4] uppercase tracking-widest block mb-2">What We Serve</span>
            <h2 className="text-3xl font-extrabold text-white">Popular Meals</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🍽️',
                title: 'Meals',
                items: ['Chicken & Chips', 'Beef Burger & Chips', 'Kids Special Combos', 'Group Meals'],
              },
              {
                emoji: '🥨',
                title: 'Snacks',
                items: ['Assorted Snacks', 'French Fries', 'Spring Rolls', 'Mini Pies'],
              },
              {
                emoji: '🥤',
                title: 'Drinks & Refreshments',
                items: ['Soft Drinks', 'Fruit Juices', 'Water', 'Ice Cream'],
              },
            ].map((cat) => (
              <div key={cat.title} className="bg-white rounded-md p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-600 text-sm">
                      •
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
