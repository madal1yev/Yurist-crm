import { useState } from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import CommandPalette from './CommandPalette'
import { LayoutDashboard, Users, Scale, CalendarDays, Bot } from 'lucide-react'

const mobileTabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/clients', icon: Users, label: 'Mijozlar' },
  { to: '/cases', icon: Scale, label: 'Ishlar' },
  { to: '/calendar', icon: CalendarDays, label: 'Kalendar' },
  { to: '/ai', icon: Bot, label: 'AI' }
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const loc = useLocation()
  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-3 sm:px-6 py-5 max-w-[1400px] w-full mx-auto pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        {/* mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-5">
            {mobileTabs.map((t) => (
              <Link key={t.to} to={t.to} className={`flex flex-col items-center gap-1 py-1.5 rounded-xl text-[10.5px] font-bold transition ${loc.pathname.startsWith(t.to) ? 'text-brand-600' : 'text-slate-400'}`}>
                <t.icon size={21} strokeWidth={loc.pathname.startsWith(t.to) ? 2.4 : 2} />
                {t.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <CommandPalette />
    </div>
  )
}
