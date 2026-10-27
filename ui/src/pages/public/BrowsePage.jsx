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

