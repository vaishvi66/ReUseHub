import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useBrowseItemsQuery, useCategoriesQuery, useSustainabilityQuery } from '../../hooks'
import { getItemImageUrl } from '../../utils/imageUrl'
import {
  TagIcon,
  GiftIcon,
  ExchangeIcon,
  BookIcon,
  LaptopIcon,
  DocumentIcon,
  ChairIcon,
  PackageIcon,
  SparklesIcon,
  LeafIcon,
  GraduationCapIcon,
  HandshakeIcon,
  ZapIcon,
  CalculatorIcon,
  MapPinIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  UsersIcon,
  RefreshCwIcon,
  StarIcon,
  ClockIcon,
  TrendingUpIcon,
  HelpCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BuildingIcon,
  GlobeIcon,
} from '../../components/Icons'

function getCategoryIcon(name, className = "w-3.5 h-3.5") {
  const n = (name || '').toLowerCase()
  if (n.includes('book')) return <BookIcon className={className} />
  if (n.includes('study') || n.includes('note') || n.includes('material')) return <DocumentIcon className={className} />
  if (n.includes('electronic') || n.includes('tech') || n.includes('calc')) return <LaptopIcon className={className} />
  if (n.includes('furniture') || n.includes('chair')) return <ChairIcon className={className} />
  return <PackageIcon className={className} />
}

function getItemEcoBadge(item, categoryName = '') {
  const cat = (categoryName || item?.category_name || '').toLowerCase()
  const name = (item?.name || '').toLowerCase()
  if (item?.listing_type === 'giveaway') {
    return { text: 'Free Campus Gift', icon: <GiftIcon className="w-3 h-3 text-emerald-300" /> }
  }
  if (cat.includes('book') || name.includes('book') || name.includes('java') || name.includes('algorithm')) {
    return { text: '~2.4 kg CO₂ Diverted', icon: <LeafIcon className="w-3 h-3 text-emerald-300" /> }
  }
  if (cat.includes('electronic') || name.includes('calc') || name.includes('fx-') || name.includes('keyboard')) {
    return { text: 'E-Waste Prevented', icon: <ZapIcon className="w-3 h-3 text-amber-300" /> }
  }
  if (cat.includes('furniture') || name.includes('chair') || name.includes('table') || name.includes('desk')) {
    return { text: 'Landfill Diverted', icon: <LeafIcon className="w-3 h-3 text-teal-300" /> }
  }
  return { text: 'Campus Reused', icon: <RefreshCwIcon className="w-3 h-3 text-emerald-300" /> }
}

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [listingType, setListingType] = useState('')
  const [condition, setCondition] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const listingsRef = useRef(null)

  const scrollToMarketplace = (catKeyword = '') => {
    if (catKeyword) {
      const found = categories.find((c) => c.name.toLowerCase().includes(catKeyword.toLowerCase()))
      if (found) {
        setSelectedCategory(String(found.id))
      } else {
        setSearch(catKeyword)
      }
    }
    if (listingsRef.current) {
      listingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const faqs = [
    {
      q: 'How does student verification work on ReUseHub?',
      a: 'Every student signs up using their official college email address and student ID number. Campus administration verifies each account before listings and pickup requests can be created, ensuring a safe, campus-only community.',
    },
    {
      q: 'Are there any hidden fees or commissions on transactions?',
      a: 'None. ReUseHub is 100% free for students and run in partnership with college sustainability initiatives. When you sell an item, you receive the full agreed amount offline from the buyer via UPI or cash during pickup.',
    },
    {
      q: 'Where do pickups and item handoffs take place?',
      a: 'Handoffs take place directly on campus at safe, well-lit designated meeting points such as the Central Library entrance, Student Center, or Hostel Reception. Owners and requesters agree on a time and campus spot right inside the platform.',
    },
    {
      q: 'Can I give away textbooks or gear for free or exchange items?',
      a: 'Yes! ReUseHub supports three flexible listing models: \'Sell\' for cash/UPI handoffs, \'100% Free Giveaway\' to pass down items to juniors, and \'Direct Exchange\' where you specify what academic materials you\'re looking for in return.',
    },
    {
      q: 'How does ReUseHub track environmental sustainability?',
      a: 'Every completed transaction automatically calculates the diverted carbon emissions, prevented e-waste, and material volume based on verified lifecycle data. You can view collective campus progress on our live Sustainability Metrics dashboard.',
    },
  ]

  const featuredVisualCategories = [
    {
      name: 'Books & Textbooks',
      sub: 'CLRS, Engineering, Medicine, Notes',
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      badge: 'Most Popular',
      filterKeyword: 'book',
      color: 'from-emerald-600 to-teal-800',
    },
    {
      name: 'Electronics & Lab Tech',
      sub: 'Casio Calculators, Arduinos, Monitors',
      img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
      badge: 'E-Waste Saver',
      filterKeyword: 'electronic',
      color: 'from-blue-600 to-indigo-800',
    },
    {
      name: 'Dorm Furniture & Chairs',
      sub: 'Study Chairs, Desks, Storage Units',
      img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
      badge: 'Zero Landfill',
      filterKeyword: 'furniture',
      color: 'from-amber-600 to-orange-800',
    },
    {
      name: 'Engineering & Drafting Tools',
      sub: 'Mini Drafters, T-Squares, Toolboxes',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      badge: 'Lab Ready',
      filterKeyword: 'drafter',
      color: 'from-purple-600 to-fuchsia-800',
    },
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      dept: 'Computer Science, Batch of 2027',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      text: 'Saved over ₹4,200 on CLRS algorithms and operating systems textbooks in my 3rd semester. Met the senior right outside Central Library between lectures!',
      tag: 'Saved ₹4,200',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      dept: 'Mechanical Engineering, Batch of 2025',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
      text: 'Passed down my Casio scientific calculator and mini drafter to an incoming fresher in less than 15 minutes. It feels great knowing equipment gets reused.',
      tag: 'Passed Down 3 Items',
      rating: 5,
    },
    {
      name: 'Ananya Mukherjee',
      dept: 'Electrical Engineering, Batch of 2026',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
      text: 'Gave away my dorm ergonomic study chair during room shifting instead of throwing it out. The live CO₂ metrics made our hostel floor super proud!',
      tag: '100% Free Giveaway',
      rating: 5,
    },
  ]

  const { data: sustainStats } = useSustainabilityQuery()
  const { categories = [], isLoading: categoriesLoading } = useCategoriesQuery()

  const categoryMap = useMemo(() => {
    const map = {}
    categories.forEach((cat) => {
      map[String(cat.id)] = cat.name
    })
    return map
  }, [categories])

  const params = {}
  if (selectedCategory) params.category_id = selectedCategory
  if (search.trim()) params.search = search.trim()
  if (listingType) params.listing_type = listingType
  if (condition) params.condition = condition

  const {
    data: items = [],
    isLoading: itemsLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useBrowseItemsQuery(params)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modern Hero Banner with High-End Animated Circular Economy Visual */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl mb-8 relative overflow-hidden border border-emerald-800/40">
        
        {/* Subtle Tech Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Radiant Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle, CTAs, Trust Highlights */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide mb-4 text-emerald-200 border border-white/15 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Campus Circular Economy</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-300">Verified Peer-to-Peer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12]">
              Give Items a <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">Second Life</span> on Campus
            </h1>

            <p className="mt-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
              Buy, sell, exchange, or give away textbooks, lab gear, calculators, and dorm essentials directly with verified students. Zero waste, zero fees.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/how-it-works"
                className="px-5 py-2.5 bg-white text-emerald-950 text-xs sm:text-sm font-black rounded-xl shadow-lg hover:bg-emerald-50 hover:shadow-xl hover:scale-102 transition-all duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>How It Works</span>
                <ArrowRightIcon className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/sustainability"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl backdrop-blur-md border border-white/15 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <LeafIcon className="w-4 h-4 text-emerald-300" />
                <span>Campus Impact Metrics</span>
              </Link>
            </div>

            {/* Micro Trust Highlights */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg text-[11px] sm:text-xs">
              <div className="flex items-center gap-2.5 text-emerald-200 font-medium">
                <span className="w-7 h-7 rounded-xl bg-emerald-800/80 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                  <GraduationCapIcon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white leading-tight truncate">Verified IDs</p>
                  <p className="text-[10px] text-emerald-300/80 truncate">Campus-only</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-emerald-200 font-medium">
                <span className="w-7 h-7 rounded-xl bg-emerald-800/80 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                  <HandshakeIcon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white leading-tight truncate">Direct Pickup</p>
                  <p className="text-[10px] text-emerald-300/80 truncate">Library & Dorms</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-emerald-200 font-medium">
                <span className="w-7 h-7 rounded-xl bg-emerald-800/80 border border-emerald-700/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                  <ZapIcon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white leading-tight truncate">Zero Fees</p>
                  <p className="text-[10px] text-emerald-300/80 truncate">100% Student Free</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Circular Economy Visual Animation */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6 lg:py-8">
            {/* Visual Container */}
            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center select-none">
              
              {/* Radar Expanding Rings (Campus Beacon Waves) */}
              <div className="absolute w-36 h-36 rounded-full border border-emerald-400/40 animate-radar-1 pointer-events-none" />
              <div className="absolute w-36 h-36 rounded-full border border-teal-400/30 animate-radar-2 pointer-events-none" />

              {/* Outer Orbit Track (Clockwise 26s) with Glowing Satellites */}
              <div className="absolute inset-2 sm:inset-4 rounded-full border border-dashed border-emerald-400/35 animate-orbit-spin pointer-events-none">
                {/* Orbit Satellite 1 */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80 flex items-center justify-center ring-2 ring-emerald-950">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                {/* Orbit Satellite 2 */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-400 shadow-lg shadow-teal-400/80 flex items-center justify-center ring-2 ring-emerald-950">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Inner Counter-Orbit Track (Counter-Clockwise 20s) */}
              <div className="absolute inset-9 sm:inset-12 rounded-full border border-dashed border-teal-300/30 animate-orbit-reverse pointer-events-none">
                {/* Inner Satellite Node */}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md shadow-teal-300/90 flex items-center justify-center ring-2 ring-emerald-950">
                  <div className="w-1 h-1 rounded-full bg-emerald-600" />
                </div>
                {/* Inner Satellite Node 2 */}
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-300 shadow-md shadow-emerald-300/80 flex items-center justify-center ring-2 ring-emerald-950">
                  <div className="w-1 h-1 rounded-full bg-teal-800" />
                </div>
              </div>

              {/* Multi-layered Radiant Glow behind core */}
              <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-emerald-500/35 via-teal-400/30 to-emerald-400/30 blur-2xl animate-pulse-glow pointer-events-none" />

              {/* Central Glowing Core (ReUseHub Circular Badge) */}
              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex flex-col items-center justify-center text-white shadow-2xl shadow-emerald-500/50 border border-white/40 backdrop-blur-md group hover:scale-105 transition-all duration-300 cursor-default">
                {/* Rotating Recycle Vector Icon */}
                <svg
                  className="w-10 h-10 sm:w-11 sm:h-11 text-white transform group-hover:rotate-180 transition-transform duration-700 drop-shadow-md"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                  <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                  <path d="m14 16-3 3 3 3" />
                  <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
                  <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
                  <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
                </svg>
                
                <span className="text-[9px] font-black uppercase tracking-wider mt-0.5 text-emerald-100">
                  Circular Hub
                </span>
                
                {/* Pulsing Beacon Dot */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 ring-2 ring-emerald-950"></span>
                </span>
              </div>

              {/* Floating Story Card 1: Senior to Junior Textbook (Top Left) */}
              <div className="absolute -top-5 -left-4 sm:-left-7 z-20 animate-float-slow">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-2.5 sm:gap-3 text-left max-w-[200px] sm:max-w-[220px] hover:scale-105 transition-all duration-300 group cursor-default">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-md">
                    <BookIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-white truncate">Java Textbook</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">Free</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <p className="text-[9px] sm:text-[10px] text-emerald-200/90 truncate">Senior &rarr; 2nd Yr Student</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Story Card 2: Lab Tech Handover (Bottom Right) */}
              <div className="absolute -bottom-5 -right-4 sm:-right-7 z-20 animate-float-delayed">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-2.5 sm:gap-3 text-left max-w-[210px] sm:max-w-[230px] hover:scale-105 transition-all duration-300 group cursor-default">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <CalculatorIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-white truncate">Casio fx-991EX</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/30 text-sky-300 border border-sky-400/30">Saved ₹600</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPinIcon className="w-3 h-3 text-sky-300 shrink-0" />
                      <p className="text-[9px] sm:text-[10px] text-teal-200/90 truncate">Pickup @ Library Gate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Story Card 3: Notes Swap (Top Right) */}
              <div className="absolute top-1 -right-3 sm:-right-6 z-20 animate-float-gentle">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center gap-2 text-left max-w-[170px] sm:max-w-[190px] hover:scale-105 transition-all duration-300 cursor-default">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <DocumentIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-extrabold text-white truncate">DBMS Notes</span>
                      <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">Swap</span>
                    </div>
                    <p className="text-[8.5px] sm:text-[9px] text-purple-200/80 truncate mt-0.5">🟢 Verified Handover</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 4: Zero Landfill Waste (Bottom Left) */}
              <div className="absolute bottom-3 -left-3 sm:-left-6 z-20 animate-float-slow">
                <div className="bg-slate-950/90 backdrop-blur-md border border-teal-400/40 px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                  <LeafIcon className="w-3.5 h-3.5 text-teal-300" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-teal-200">Zero Landfill Waste</span>
                </div>
              </div>

              {/* Micro Tech Sparks drifting */}
              <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-emerald-300 animate-float-drift-1 blur-[0.5px] pointer-events-none" />
              <div className="absolute bottom-12 right-12 w-2 h-2 rounded-full bg-teal-300 animate-float-drift-2 blur-[0.5px] pointer-events-none" />

            </div>
          </div>
        </div>

        {/* Interactive Categories Filter Bar inside Hero Banner */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-emerald-200 mr-2 flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Categories:</span>
          </span>

          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === ''
                ? 'bg-white text-emerald-950 shadow-md font-extrabold scale-102'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <SparklesIcon className="w-3.5 h-3.5 text-emerald-800" />
            <span>All Categories</span>
          </button>
          
          {categoriesLoading ? (
            <span className="text-xs text-emerald-200">Loading categories...</span>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === String(cat.id)
                    ? 'bg-white text-emerald-950 shadow-md font-extrabold scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {getCategoryIcon(cat.name, "w-3.5 h-3.5")}
                <span>{cat.name}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Campus Trust Strip: 4 Key Value Pillars (Distinct Professional Color Identity) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Card 1: Verified Students (Royal Indigo / Blue - Security & Trust) */}
        <div className="group relative bg-white dark:bg-slate-900 hover:bg-gradient-to-b hover:from-white dark:hover:from-slate-900 hover:to-indigo-50/60 dark:hover:to-indigo-950/40 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400/80 dark:hover:border-indigo-500/70 p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:shadow-indigo-950/10 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 group-hover:via-indigo-500 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/15 transition-colors" />
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30 group-hover:scale-108 transition-transform duration-300">
            <ShieldCheckIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors truncate">
              Verified Students
            </h4>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Campus ID checked
            </p>
          </div>
        </div>

        {/* Card 2: Direct Pickup (Emerald / Mint - Campus Meetups & Delivery) */}
        <div className="group relative bg-white dark:bg-slate-900 hover:bg-gradient-to-b hover:from-white dark:hover:from-slate-900 hover:to-emerald-50/60 dark:hover:to-emerald-950/40 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400/80 dark:hover:border-emerald-500/70 p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:shadow-emerald-950/10 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 group-hover:via-emerald-500 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/15 transition-colors" />
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30 group-hover:scale-108 transition-transform duration-300">
            <MapPinIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-900 dark:group-hover:text-emerald-300 transition-colors truncate">
              Direct Pickup
            </h4>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Library & dorm hubs
            </p>
          </div>
        </div>

        {/* Card 3: Zero Commission (Warm Amber / Gold - Savings & Speed) */}
        <div className="group relative bg-white dark:bg-slate-900 hover:bg-gradient-to-b hover:from-white dark:hover:from-slate-900 hover:to-amber-50/60 dark:hover:to-amber-950/40 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-amber-400/80 dark:hover:border-amber-500/70 p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:shadow-amber-950/10 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0 group-hover:via-amber-500 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/15 transition-colors" />
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30 group-hover:scale-108 transition-transform duration-300">
            <ZapIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors truncate">
              Zero Platform Fees
            </h4>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              100% peer exchange
            </p>
          </div>
        </div>

        {/* Card 4: Circular Economy (Royal Violet / Purple - Campus Eco Loop & Swaps) */}
        <div className="group relative bg-white dark:bg-slate-900 hover:bg-gradient-to-b hover:from-white dark:hover:from-slate-900 hover:to-purple-50/60 dark:hover:to-purple-950/40 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-purple-400/80 dark:hover:border-purple-500/70 p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:shadow-purple-950/10 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 group-hover:via-purple-500 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/15 transition-colors" />
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30 group-hover:scale-108 transition-transform duration-300">
            <RefreshCwIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-purple-900 dark:group-hover:text-purple-300 transition-colors truncate">
              Circular Impact
            </h4>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Zero campus landfill
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 mb-8 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between transition-colors">
        <div className="w-full md:w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search items (e.g. calculator, java)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition"
          >
            <option value="">All Types (Sell / Free / Exchange)</option>
            <option value="sell">For Sale</option>
            <option value="giveaway">Free Giveaway</option>
            <option value="exchange">Exchange</option>
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition"
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCwIcon className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Items Section */}
      <section ref={listingsRef}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Available Campus Listings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified peer-to-peer listings from fellow students</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{items.length} items available</span>
        </div>

        {itemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden p-0 animate-pulse flex flex-col"
              >
                <div className="aspect-4/3 w-full bg-slate-200 dark:bg-slate-800" />
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-2/3" />
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-md w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 p-8 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/80 text-rose-600 dark:text-rose-300 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              !
            </div>
            <p className="text-rose-900 dark:text-rose-200 font-bold text-base">Failed to load marketplace items</p>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error?.message || 'Please check backend connection.'}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 shadow-sm transition cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner text-emerald-600 dark:text-emerald-400">
              <PackageIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-slate-900 dark:text-white font-bold text-base">No items found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">There are currently no listings matching your search or filters.</p>
            {(selectedCategory || search || listingType || condition) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSearch('')
                  setListingType('')
                  setCondition('')
                }}
                className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const categoryName = categoryMap[item.category_id] || item.category_name || 'Campus'
              const ecoBadge = getItemEcoBadge(item, categoryName)
              return (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="group relative rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-emerald-950/15 dark:hover:shadow-black/50 hover:border-emerald-400 dark:hover:border-emerald-500/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={getItemImageUrl(item)}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Shimmer Light Reflection Sweep on Hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                    {/* Subtle Gradient Overlay for High Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30 pointer-events-none" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      {/* Listing Type Tag */}
                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 tracking-tight ${
                          item.listing_type === 'sell'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-900/30'
                            : item.listing_type === 'giveaway'
                              ? 'bg-gradient-to-r from-sky-600 to-blue-500 text-white shadow-blue-900/30'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-purple-900/30'
                        }`}
                      >
                        {item.listing_type === 'sell' && (
                          <>
                            <TagIcon className="w-3.5 h-3.5" />
                            <span>For Sale</span>
                          </>
                        )}
                        {item.listing_type === 'giveaway' && (
                          <>
                            <GiftIcon className="w-3.5 h-3.5" />
                            <span>Free Gift</span>
                          </>
                        )}
                        {item.listing_type === 'exchange' && (
                          <>
                            <ExchangeIcon className="w-3.5 h-3.5" />
                            <span>Exchange</span>
                          </>
                        )}
                      </span>

                      {/* Condition Pill with glowing dot */}
                      <span className="text-[11px] font-semibold bg-slate-950/65 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm capitalize">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ring-2 ring-white/30 ${
                            item.condition === 'new'
                              ? 'bg-emerald-400'
                              : item.condition === 'like_new'
                                ? 'bg-teal-400'
                                : item.condition === 'good'
                                  ? 'bg-sky-400'
                                  : 'bg-amber-400'
                          }`}
                        />
                        {item.condition?.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Bottom Floating Info: Category Pill & Eco Badge */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-lg shadow-sm border border-white/60 dark:border-slate-700">
                        {categoryName}
                      </span>
                      
                      <span className="text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                        {ecoBadge.icon}
                        <span>{ecoBadge.text}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                        <CheckCircleIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified Student Listing</span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Exchange Requirement Callout */}
                      {item.listing_type === 'exchange' && item.exchange_requirement && (
                        <div className="mt-2.5 px-2.5 py-1 rounded-xl bg-purple-50/90 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/60 text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1.5 truncate">
                          <span className="font-bold text-purple-900 dark:text-purple-200 shrink-0">Seeking:</span>
                          <span className="truncate">{item.exchange_requirement}</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Location Bottom Bar */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        {item.listing_type === 'sell' && item.price ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">₹{item.price}</span>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Fixed</span>
                          </div>
                        ) : item.listing_type === 'giveaway' ? (
                          <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-200/80 dark:border-sky-800/60">
                            100% Free
                          </span>
                        ) : (
                          <span className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-200/80 dark:border-purple-800/60">
                            Direct Swap
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 max-w-[130px] truncate">
                        <MapPinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location || 'Campus'}</span>
                      </div>
                    </div>

                    {/* View Details Interactive Pill Link */}
                    <div className="mt-3 pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Campus Pickup</span>
                      <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition">
                        <span>View Details</span>
                        <ArrowRightIcon className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* 4. Curated Academic Category Collections */}
      <section className="mt-16 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
              <SparklesIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Academic Essentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Curated Campus Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Find exactly what you need for this semester, passed down directly by seniors across university departments.
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Click any category to filter listings ↓
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredVisualCategories.map((cat, i) => (
            <div
              key={i}
              onClick={() => scrollToMarketplace(cat.filterKeyword)}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-40 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 shadow-md backdrop-blur-md">
                    {cat.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-base tracking-tight leading-snug drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-200/90 truncate mt-0.5 font-medium">
                    {cat.sub}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                <span>Browse Category</span>
                <ArrowRightIcon className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Dual Feature Spotlight Cards for /how-it-works & /sustainability */}
      <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Spotlight Card 1: How It Works */}
        <div className="group relative rounded-3xl overflow-hidden border border-emerald-800/30 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-700">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Students collaborating"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/95 via-teal-950/90 to-slate-950/95 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-emerald-300 mb-4">
              <RefreshCwIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Handover Workflow</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Simple 4-Step Peer Handshake
            </h3>
            
            <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg">
              No shipping delays, no strangers, and no platform fees. Discover how easy it is to pass down textbooks or pick up essentials between lectures.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                <span className="text-emerald-400 font-black text-xs">01</span>
                <p className="text-[11px] font-bold text-white mt-1 leading-tight">Verify ID</p>
                <p className="text-[9.5px] text-emerald-200/70 mt-0.5">College email</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                <span className="text-teal-400 font-black text-xs">02</span>
                <p className="text-[11px] font-bold text-white mt-1 leading-tight">List in 60s</p>
                <p className="text-[9.5px] text-teal-200/70 mt-0.5">Sell, free, swap</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                <span className="text-sky-400 font-black text-xs">03</span>
                <p className="text-[11px] font-bold text-white mt-1 leading-tight">Pick Spot</p>
                <p className="text-[9.5px] text-sky-200/70 mt-0.5">Library gate</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                <span className="text-amber-400 font-black text-xs">04</span>
                <p className="text-[11px] font-bold text-white mt-1 leading-tight">Handover</p>
                <p className="text-[9.5px] text-amber-200/70 mt-0.5">Zero fees</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-emerald-200/80 font-medium">Takes less than 2 minutes to start</span>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md hover:bg-emerald-50 hover:scale-102 transition-all cursor-pointer group/btn"
            >
              <span>Explore How It Works</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-emerald-800 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Spotlight Card 2: Campus Sustainability Dashboard */}
        <div className="group relative rounded-3xl overflow-hidden border border-teal-800/30 bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-950 text-white p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-700">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
              alt="Lush campus green"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/95 via-emerald-950/90 to-slate-950/95 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-teal-300 mb-4">
              <LeafIcon className="w-3.5 h-3.5 text-teal-400" />
              <span>Campus Circular Economy</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Real Environmental Impact
            </h3>
            
            <p className="mt-3 text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-lg">
              Every reused textbook saves ~2.4 kg of CO₂ and pulp water. Every scientific calculator reused prevents hazardous e-waste from entering local landfills.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
                  <LeafIcon className="w-4 h-4 text-emerald-400" />
                  <span>{sustainStats?.co2_diverted_kg != null ? `${sustainStats.co2_diverted_kg} kg` : '150.4 kg'}</span>
                </div>
                <p className="text-[11px] font-extrabold text-white mt-0.5">CO₂ Diverted</p>
                <p className="text-[9.5px] text-emerald-200/70">From campus lifecycle</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                  <ZapIcon className="w-4 h-4 text-amber-400" />
                  <span>{sustainStats?.electronics_count != null ? `${sustainStats.electronics_count} Devices` : '7 Devices'}</span>
                </div>
                <p className="text-[11px] font-extrabold text-white mt-0.5">E-Waste Prevented</p>
                <p className="text-[9.5px] text-amber-200/70">Calculators & lab gear</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-sky-300 text-xs font-bold">
                  <BookIcon className="w-4 h-4 text-sky-400" />
                  <span>{sustainStats?.books_count != null ? `${sustainStats.books_count} Books` : '11 Books'}</span>
                </div>
                <p className="text-[11px] font-extrabold text-white mt-0.5">Handed Down</p>
                <p className="text-[9.5px] text-sky-200/70">CLRS & study notes</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold">
                  <TrendingUpIcon className="w-4 h-4 text-purple-400" />
                  <span>{sustainStats?.total_student_savings != null ? `₹${sustainStats.total_student_savings.toLocaleString('en-IN')}` : '₹10,720'}</span>
                </div>
                <p className="text-[11px] font-extrabold text-white mt-0.5">Student Savings</p>
                <p className="text-[9.5px] text-purple-200/70">Direct peer savings</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-teal-200/80 font-medium">Live campus telemetry</span>
            <Link
              to="/sustainability"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer group/btn"
            >
              <span>Live Sustainability Data</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-slate-950 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </section>

      {/* 6. Why ReUseHub: The Campus Advantage */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Campus Advantage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Students Choose ReUseHub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Designed specifically around college geography, semester rhythms, and campus safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
              Verified Student IDs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every user registers with their official college email and student ID. No outside commercial vendors or anonymous strangers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ZapIcon className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
              Zero Commission
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              100% of the sale stays with you. No platform fees, listing charges, or transaction deductions. Free for all verified students.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <MapPinIcon className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
              Daylight Campus Pickups
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Handoffs take place right outside the Central Library, Student Center, or Hostel Receptions. Zero shipping waits or unsafe travel.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <LeafIcon className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
              Circular Mentorship
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Seniors pass down not just books and equipment, but tips on exams, professors, and lab coursework directly to juniors.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Senior-to-Junior Handover Stories */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            <StarIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Loved by Seniors & Juniors Alike
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            See how peer-to-peer item sharing is transforming university life across campus batches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {t.tag}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {t.dept}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Frequently Asked Questions (Accordion) */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            <HelpCircleIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Everything you need to know about campus verification, meeting safety, and listing items.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 9. Bottom High-Impact CTA Banner */}
      <section className="mb-12">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-emerald-800/40 text-center sm:text-left">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300 mb-3">
                <SparklesIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Start In 60 Seconds</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Ready to Declutter Your Dorm Room?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Give your textbooks, lab gear, and study tools a second life. Join 480+ verified peers at your college campus today.
              </p>
              
              <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  to="/create-listing"
                  className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-black text-xs sm:text-sm shadow-lg hover:bg-emerald-50 hover:scale-102 transition-all cursor-pointer"
                >
                  List an Item for Free
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/15 transition-all cursor-pointer"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>

            <div className="shrink-0 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md max-w-xs text-center w-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto mb-3">
                <UsersIcon className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-white">{sustainStats?.active_students ? `${sustainStats.active_students} Verified Peers` : "7 Verified Peers"}</h4>
              <p className="text-[11px] text-emerald-200/80 mt-1">Exchanging items on campus this semester</p>
              <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-teal-300 font-semibold flex items-center justify-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Student Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
