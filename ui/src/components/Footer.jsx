import { Link } from 'react-router-dom'
import {
  SparklesIcon,
  LeafIcon,
  ShieldCheckIcon,
  MapPinIcon,
  GraduationCapIcon,
  BookIcon,
  LaptopIcon,
  ChairIcon,
  ArrowRightIcon,
} from './Icons'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors mt-auto">
      {/* Upper Footer: Campus Value & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Platform Identity & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900 dark:text-white group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <LeafIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                ReUse<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The verified circular economy marketplace built exclusively for university students. Pass down textbooks, lab gear, calculators, and dorm essentials with zero platform fees.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Campus IDs</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[11px] font-bold text-teal-800 dark:text-teal-300">
                <LeafIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Zero Campus Landfill</span>
              </span>
            </div>
          </div>

          {/* Col 3: Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/browse" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRightIcon className="w-3 h-3 text-slate-400" />
                  <span>Browse All Items</span>
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRightIcon className="w-3 h-3 text-slate-400" />
                  <span>How It Works</span>
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRightIcon className="w-3 h-3 text-slate-400" />
                  <span>Campus Impact Metrics</span>
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ArrowRightIcon className="w-3 h-3 text-slate-400" />
                  <span>List Unused Item (Free)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Popular Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Academic Hubs
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/browse" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Textbooks & CLRS</span>
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <LaptopIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Calculators & Lab Tech</span>
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChairIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dorm Study Chairs</span>
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-purple-500" />
                  <span>Giveaways & Swaps</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Safety & Meetup Standards */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Campus Safety
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Central Library Steps & Student Union Handoffs</span>
              </li>
              <li className="flex items-start gap-2">
                <GraduationCapIcon className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>Institutional .edu Email Verification Required</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Direct UPI / Cash — Zero Intermediary Escrow Risk</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower Footer: Centered Copyright */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 py-5 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 text-center">
            <span>© {new Date().getFullYear()} ReUseHub Platform.</span>
            <span>•</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400">Student-Led Campus Circular Economy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
