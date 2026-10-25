import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from './Icons'

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
        isDark
          ? 'bg-slate-800/90 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300 shadow-sm shadow-amber-500/10'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-emerald-700 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <SunIcon className="w-4 h-4 transform rotate-0 hover:rotate-90 transition-transform duration-500 text-amber-400 drop-shadow-sm" />
        ) : (
          <MoonIcon className="w-4 h-4 transform -rotate-12 hover:rotate-0 transition-transform duration-500 text-slate-700" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

