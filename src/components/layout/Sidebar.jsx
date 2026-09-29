import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Scale, CalendarDays, CreditCard, FolderOpen, MessagesSquare,
  UsersRound, BarChart3, Settings, ChevronsLeft, ChevronsRight, Scale as LogoIcon,
  CheckSquare, FileSignature, Wallet, UserPlus, FileText, Bot, Bell, Globe,
  PenLine, Workflow, ShieldCheck, ScrollText, DatabaseBackup, LogOut
} from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { useLang } from '../../i18n'
import { motion } from 'framer-motion'

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { sidebarCollapsed, setSidebarCollapsed, convs, profile, logout, toast } = useStore()
  const { t } = useLang()
  const navigate = useNavigate()
  const unread = convs.reduce((a, c) => a + (c.unread || 0), 0)

  const doLogout = () => {
    logout()
    toast('Tizimdan chiqdingiz', 'info')
    setMobileOpen(false)
    navigate('/', { replace: true })
  }

  const groups = [
    {
      title: t('grp.main'), links: [
        { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { to: '/clients', label: t('nav.clients'), icon: Users },
        { to: '/cases', label: t('nav.cases'), icon: Scale },
        { to: '/tasks', label: t('nav.tasks'), icon: CheckSquare },
        { to: '/calendar', label: t('nav.calendar'), icon: CalendarDays },
        { to: '/documents', label: t('nav.documents'), icon: FolderOpen },
        { to: '/messages', label: t('nav.messages'), icon: MessagesSquare, badge: unread }
      ]
    },
    {
      title: t('grp.business'), links: [
        { to: '/contracts', label: t('nav.contracts'), icon: FileSignature },
        { to: '/payments', label: t('nav.payments'), icon: CreditCard },
        { to: '/expenses', label: t('nav.expenses'), icon: Wallet },
        { to: '/leads', label: t('nav.leads'), icon: UserPlus },
        { to: '/reports', label: t('nav.reports'), icon: FileText }
      ]
    },
    {
      title: t('grp.ext'), links: [
        { to: '/ai', label: t('nav.ai'), icon: Bot },
        { to: '/notifications', label: t('nav.notif'), icon: Bell },
        { to: '/portal', label: t('nav.portal'), icon: Globe },
        { to: '/esign', label: t('nav.esign'), icon: PenLine },
        { to: '/workflow', label: t('nav.workflow'), icon: Workflow }
      ]
    },
    {
      title: t('grp.sec'), links: [
        { to: '/roles', label: t('nav.roles'), icon: ShieldCheck },
        { to: '/audit', label: t('nav.audit'), icon: ScrollText },
        { to: '/backup', label: t('nav.backup'), icon: DatabaseBackup },
        { to: '/team', label: t('nav.team'), icon: UsersRound },
        { to: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
        { to: '/settings', label: t('nav.settings'), icon: Settings }
      ]
    }
  ]

  const body = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 shrink-0">
          <LogoIcon size={20} />
        </div>
        {!sidebarCollapsed && (
          <div className="leading-tight">
            <p className="font-display font-extrabold text-[17px] text-slate-900 dark:text-white tracking-tight">LawCRM</p>
            <p className="text-[11px] text-slate-400 font-medium">Legal Tech SaaS</p>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto scroll-thin px-3 pb-3 space-y-4">
        {groups.map((g) => (
          <div key={g.title}>
            {!sidebarCollapsed && <p className="px-3 pt-1 pb-1.5 text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{g.title}</p>}
            <div className="space-y-1">
              {g.links.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} title={sidebarCollapsed ? l.label : undefined}
                  className={({ isActive }) => `navlink ${isActive ? 'navlink-active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
                  <l.icon size={19} strokeWidth={2.1} />
                  {!sidebarCollapsed && <span className="flex-1 truncate">{l.label}</span>}
                  {!sidebarCollapsed && !!l.badge && l.badge > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">{l.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 px-2 py-1">
            <Avatar />
            <div className="flex-1 leading-tight min-w-0">
              <p className="text-[13px] font-bold truncate dark:text-white">{profile.name}</p>
              <p className="text-[11px] text-slate-400">{profile.role}</p>
            </div>
            <button onClick={doLogout} title={t('hdr.exit')} className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition">
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <button onClick={doLogout} title={t('hdr.exit')} className="w-full flex justify-center p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"><LogOut size={18} /></button>
        )}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex mt-2 w-full items-center justify-center gap-2 text-[12px] font-semibold text-slate-400 hover:text-brand-600 py-2 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800 transition">
          {sidebarCollapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Yig‘ish</>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <motion.aside animate={{ width: sidebarCollapsed ? 76 : 248 }}
        className="hidden lg:block shrink-0 sticky top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200/70 dark:border-slate-800 z-40 overflow-hidden">
        {body}
      </motion.aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-[270px] bg-white dark:bg-slate-900 shadow-pop overflow-y-auto">
            {body}
          </motion.div>
        </div>
      )}
    </>
  )
}

function Avatar() {
  const { avatar, profile } = useStore()
  if (avatar) return <img src={avatar} alt="admin" className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-100" />
  const ini = (profile.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{ini}</div>
}
