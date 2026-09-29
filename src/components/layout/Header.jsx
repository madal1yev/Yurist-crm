import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Bell, Menu, Sun, Moon, ChevronDown, User, CreditCard, FileText, CalendarDays, Users, Languages, LogOut } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { useLang } from '../../i18n'
import { AnimatePresence, motion } from 'framer-motion'

const notifIcon = {
  client: <Users size={16} className="text-blue-600" />,
  payment: <CreditCard size={16} className="text-emerald-600" />,
  deadline: <CalendarDays size={16} className="text-red-600" />,
  appointment: <CalendarDays size={16} className="text-amber-600" />,
  document: <FileText size={16} className="text-violet-600" />
}

const LANGS = [['uz', 'UZ'], ['ru', 'RU'], ['tr', 'TR']]

export default function Header({ onMenu }) {
  const { notifs, setNotifs, theme, setTheme, setCmdkOpen, avatar, profile, logout, toast } = useStore()
  const { t, lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [langs, setLangs] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const unread = notifs.filter((n) => !n.read).length
  const initials = (profile.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setProfileOpen(false); setLangs(false) } }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const doLogout = () => { setProfileOpen(false); logout(); toast('Tizimdan chiqdingiz', 'info'); navigate('/', { replace: true }) }

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800">
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 h-[68px]">
        <button onClick={onMenu} className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><Menu size={20} /></button>
        <button onClick={() => setCmdkOpen(true)}
          className="hidden md:flex items-center gap-3 flex-1 max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-400 hover:border-brand-300 hover:ring-2 hover:ring-brand-500/20 transition text-left">
          <Search size={17} />
          <span className="flex-1 truncate">{t('hdr.searchPh')}</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-500">Ctrl K</kbd>
        </button>
        <button onClick={() => setCmdkOpen(true)} className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><Search size={20} /></button>
        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-2 sm:gap-3" ref={ref}>
          <div className="relative">
            <button onClick={() => { setLangs(!langs); setOpen(false); setProfileOpen(false) }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs font-extrabold dark:text-slate-200">
              <Languages size={15} className="text-slate-400" />{lang.toUpperCase()}
            </button>
            <AnimatePresence>
              {langs && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-44 card shadow-pop p-1.5">
                  {LANGS.map(([v, l]) => (
                    <button key={v} onClick={() => { setLang(v); setLangs(false) }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition ${lang === v ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200'}`}>
                      {l} {lang === v && <span className="text-brand-600">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Mavzu">
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
          <div className="relative">
            <button onClick={() => { setOpen(!open); setProfileOpen(false); setLangs(false) }} className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <Bell size={18} />
              {unread > 0 && <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-red-500 text-white text-[10.5px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">{unread}</span>}
            </button>
            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-[330px] max-w-[86vw] card shadow-pop overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-sm dark:text-white">{t('hdr.notif')}</p>
                    <button onClick={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))} className="text-xs font-bold text-brand-600 hover:underline">{t('hdr.markAll')}</button>
                  </div>
                  <div className="max-h-[340px] overflow-y-auto scroll-thin">
                    {notifs.map((n) => (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition ${!n.read ? 'bg-brand-50/50 dark:bg-brand-600/5' : ''}`}>
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">{notifIcon[n.type] || <Bell size={16} />}</div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold dark:text-white flex items-center gap-2">{n.title} {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600" />}</p>
                          <p className="text-xs text-slate-500 truncate">{n.text}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/notifications" onClick={() => setOpen(false)} className="block text-center text-xs font-bold text-brand-600 py-2.5 border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">{t('c.more')} →</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setOpen(false); setLangs(false) }} className="flex items-center gap-2 p-1.5 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              {avatar
                ? <img src={avatar} alt="admin" className="w-9 h-9 rounded-xl object-cover" />
                : <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold">{initials}</div>}
              <ChevronDown size={15} className="text-slate-400 hidden sm:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-56 card shadow-pop p-2">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-sm font-bold dark:text-white">{profile.name}</p>
                    <p className="text-xs text-slate-400 truncate">{profile.email}</p>
                  </div>
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200"><User size={15} /> Profil</button>
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200"><CreditCard size={15} /> Billing</button>
                  <button onClick={doLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut size={15} /> {t('hdr.exit')}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
