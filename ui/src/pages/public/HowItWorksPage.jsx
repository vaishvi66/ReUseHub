import { Link } from 'react-router-dom'

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'List an Unused Item',
      desc: 'Snap a photo of your textbook, calculator, electronics, or dorm gear. Specify if you want to sell it, give it away for free, or exchange it.',
      badge: 'Step 1',
    },
    {
      num: '02',
      title: 'Admin Verification',
      desc: 'Campus administrators review listings to ensure safety, authenticity, and college guideline compliance before items appear on the campus feed.',
      badge: 'Step 2',
    },
    {
      num: '03',
      title: 'Request & Arrange Pickup',
      desc: 'A fellow student sends a request with an optional note. The owner accepts and arranges an on-campus pickup location, date, and time.',
      badge: 'Step 3',
    },
    {
      num: '04',
      title: 'Offline Handoff & Reuse',
      desc: 'Students meet safely on campus to hand off the item (and offline payment if selling). Both parties mark the transaction completed, preventing landfill waste.',
      badge: 'Step 4',
    },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          Campus Circular Economy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
          How ReUseHub Works
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          A peer-to-peer campus platform designed to extend the lifespan of college materials while keeping exchanges direct, safe, and transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {steps.map((s) => (
          <div
            key={s.num}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs hover:shadow-md transition relative"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/60">
                {s.badge}
              </span>
              <span className="text-2xl font-black text-slate-200 dark:text-slate-700">{s.num}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white p-8 text-center max-w-2xl mx-auto shadow-xl">
        <h3 className="text-xl font-bold">Ready to participate?</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Sign up with your college email and student ID to start sharing resources today.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/register"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Get Started
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </main>
  )
}
