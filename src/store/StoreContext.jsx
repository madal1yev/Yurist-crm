import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { seedClients, seedCases, seedPayments, seedEvents, seedDocs, seedTeam, seedMessages, seedNotifications } from '../data/mockData'
import { notifyStaff } from '../services/telegram'
import { uid } from '../utils/format'

const seedTasks = [
  { id: 'ts_1', title: 'Da’vo ariza loyihasini tayyorlash', caseId: 'LC-2026-002', owner: 'Madina Rahimova', priority: 'High', status: 'Bajarildi', deadline: '2026-09-20' },
  { id: 'ts_2', title: 'Kadastr ma’lumotnomasini olish', caseId: 'LC-2026-004', owner: 'Abdulaziz Yusupov', priority: 'Urgent', status: 'Jarayonda', deadline: '2026-09-30' },
  { id: 'ts_3', title: 'Mijoz bilan uchrashuv — Sardor U.', caseId: 'LC-2026-006', owner: 'Sevara Olimova', priority: 'Medium', status: 'Yangi', deadline: '2026-10-01' },
  { id: 'ts_4', title: 'Apellyatsiya shikoyati topshirish', caseId: 'LC-2026-004', owner: 'Abdulaziz Yusupov', priority: 'Urgent', status: 'Yangi', deadline: '2026-09-30' }
]
const seedLeads = [
  { id: 'ld_1', name: 'Oybek Toshmurodov', phone: '+998 90 456 78 90', source: 'Telegram', status: 'Yangi', created: '2026-09-28', note: 'Biznes litsenziya masalasi' },
  { id: 'ld_2', name: 'Dilnoza Ergasheva', phone: '+998 91 678 12 34', source: 'Sayt', status: 'Bog‘lanildi', created: '2026-09-26', note: 'Ajrim bo‘yicha konsultatsiya' },
  { id: 'ld_3', name: '“Tekstil Savdo” MCHJ', phone: '+998 71 200 45 67', source: 'Instagram', status: 'Uchrashuv', created: '2026-09-24', note: 'Korporativ kuzatuv' },
  { id: 'ld_4', name: 'Rustam Ibragimov', phone: '+998 93 999 00 11', source: 'Tavsiya', status: 'Yangi', created: '2026-09-29', note: 'Avto-YTH sug‘urta nizosi' }
]
const seedContracts = [
  { id: 'SH-2026-014', title: 'Yuridik xizmat shartnomasi — Qurilish MCHJ', clientId: 'cl_01', amount: 85000000, signed: '2026-06-10', expires: '2027-06-10', status: 'Faol', esign: 'Imzolangan' },
  { id: 'SH-2026-021', title: 'Retainer — IT kompaniya', clientId: 'cl_09', amount: 216000000, signed: '2026-09-01', expires: '2027-09-01', status: 'Faol', esign: 'Imzolangan' },
  { id: 'SH-2026-009', title: 'Bir martalik konsultatsiya — Hakimov', clientId: 'cl_05', amount: 45000000, signed: '2026-04-02', expires: '2026-10-02', status: 'Muddati yaqin', esign: 'Kutilmoqda' }
]
const seedExpenses = [
  { id: 'ex_1', title: 'Sud boji — Mehnat nizosi', category: 'Sud xarajatlari', amount: 1500000, date: '2026-09-12', caseId: 'LC-2026-002' },
  { id: 'ex_2', title: 'Samarqand safar xarajati', category: 'Transport', amount: 850000, date: '2026-09-15', caseId: 'LC-2026-002' },
  { id: 'ex_3', title: 'Notarial tasdiq', category: 'Hujjatlar', amount: 400000, date: '2026-09-20', caseId: 'LC-2026-004' }
]
const seedTime = [
  { id: 'tm_log1', title: 'Sud majlisi ishtiroki', caseId: 'LC-2026-002', owner: 'Madina Rahimova', hours: 3, rate: 500000, date: '2026-09-18' },
  { id: 'tm_log2', title: 'Da’vo ariza tayyorlash', caseId: 'LC-2026-001', owner: 'Abdulaziz Yusupov', hours: 5, rate: 750000, date: '2026-09-22' }
]
const seedAgent = {
  name: 'Yurist agent', profile: 'Yurist agent',
  skills: [
    { id: 'sk_search', name: 'crm-search', desc: 'Mijoz / ish / to‘lov qidirish', on: true },
    { id: 'sk_cal', name: 'crm-calendar', desc: 'Uchrashuv yaratish va o‘qish', on: true },
    { id: 'sk_tg', name: 'telegram-notify', desc: 'Xodimlarga Telegram xabarnoma', on: true },
    { id: 'sk_doc', name: 'doc-generate', desc: 'Shablon asosida hujjat loyihasi', on: false }
  ],
  memory: [
    { id: 'mm_1', kind: 'session', text: 'Abdulla Karimov — sud 15-oktabr 10:00, shartnoma ijrosi mavzusi', date: '2026-09-29' },
    { id: 'mm_2', kind: 'long', text: 'Jasur Hakimov — to‘lov kechikishi bor, eslatma kerak', date: '2026-09-25' }
  ],
  cron: [
    { id: 'cr_1', title: 'Kunlik dayjest — deadlinelar va sudlar', schedule: 'Har kuni 09:00', on: true },
    { id: 'cr_2', title: 'Haftalik tushum hisoboti', schedule: 'Dushanba 09:00', on: true }
  ]
}

const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem('lawcrm_' + key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return fallback
}
function save(key, val) {
  try { localStorage.setItem('lawcrm_' + key, JSON.stringify(val)) } catch {}
}

export function StoreProvider({ children }) {
  const [clients, setClients] = useState(() => load('clients', seedClients))
  const [cases, setCases] = useState(() => load('cases', seedCases))
  const [payments, setPayments] = useState(() => load('payments', seedPayments))
  const [events, setEvents] = useState(() => load('events', seedEvents))
  const [docs, setDocs] = useState(() => load('docs', seedDocs))
  const [team, setTeam] = useState(() => load('team', seedTeam))
  const [convs, setConvs] = useState(() => load('convs', seedMessages))
  const [notifs, setNotifs] = useState(() => load('notifs', seedNotifications))
  const [tasks, setTasks] = useState(() => load('tasks', seedTasks))
  const [leads, setLeads] = useState(() => load('leads', seedLeads))
  const [contracts, setContracts] = useState(() => load('contracts', seedContracts))
  const [expenses, setExpenses] = useState(() => load('expenses', seedExpenses))
  const [timeLogs, setTimeLogs] = useState(() => load('timeLogs', seedTime))
  const [auditLog, setAuditLog] = useState(() => load('audit', []))
  const [agent, setAgent] = useState(() => load('agent', seedAgent))
  const [avatar, setAvatar] = useState(() => localStorage.getItem('lawcrm_avatar') || '')
  const [toasts, setToasts] = useState([])
  const [theme, setTheme] = useState(() => localStorage.getItem('lawcrm_theme') || 'light')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [authed, setAuthed] = useState(() => localStorage.getItem('lawcrm_auth') === '1')
  const [profile, setProfile] = useState(() => load('profile', { name: 'Abdulaziz Yusupov', email: 'abdulaziz@lawcrm.uz', phone: '+998 90 111 22 33', role: 'Admin' }))
  const [company, setCompany] = useState(() => load('company', { name: 'Adolat Yuridik MCHJ', stir: '301234567', address: 'Toshkent sh., Amir Temur shoh k., 15-uy' }))
  const [notifPrefs, setNotifPrefs] = useState(() => load('notifPrefs', { email: true, sms: true, push: true, deadline: true }))

  useEffect(() => save('clients', clients), [clients])
  useEffect(() => save('cases', cases), [cases])
  useEffect(() => save('payments', payments), [payments])
  useEffect(() => save('events', events), [events])
  useEffect(() => save('docs', docs), [docs])
  useEffect(() => save('team', team), [team])
  useEffect(() => save('convs', convs), [convs])
  useEffect(() => save('notifs', notifs), [notifs])
  useEffect(() => save('tasks', tasks), [tasks])
  useEffect(() => save('leads', leads), [leads])
  useEffect(() => save('contracts', contracts), [contracts])
  useEffect(() => save('expenses', expenses), [expenses])
  useEffect(() => save('timeLogs', timeLogs), [timeLogs])
  useEffect(() => save('audit', auditLog.slice(0, 300)), [auditLog])
  useEffect(() => save('agent', agent), [agent])
  useEffect(() => save('profile', profile), [profile])
  useEffect(() => save('company', company), [company])
  useEffect(() => save('notifPrefs', notifPrefs), [notifPrefs])
  useEffect(() => { if (avatar) localStorage.setItem('lawcrm_avatar', avatar) }, [avatar])
  useEffect(() => {
    localStorage.setItem('lawcrm_theme', theme)
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
    apply()
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  const toast = useCallback((title, type = 'success') => {
    const id = uid('t')
    setToasts((p) => [...p, { id, title, type }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200)
  }, [])

  const pushNotif = useCallback((n) => {
    setNotifs((p) => [{ id: uid('n'), time: 'Hozir', read: false, ...n }, ...p])
    // Muhim hodisalar Telegram'ga ham boradi (sozlangan bo'lsa; xato jim yutiladi)
    if (['payment', 'deadline', 'appointment'].includes(n.type)) {
      notifyStaff(`<b>${n.title || 'LawCRM'}</b>\n${n.text || ''}`)
    }
  }, [])

  // ─── Autentifikatsiya (demo) ───
  const login = useCallback((email, name) => {
    setAuthed(true)
    localStorage.setItem('lawcrm_auth', '1')
    if (email || name) setProfile((p) => ({ ...p, email: email || p.email, name: name || p.name }))
  }, [])
  const logout = useCallback(() => {
    setAuthed(false)
    localStorage.removeItem('lawcrm_auth')
  }, [])
  const updateProfile = useCallback((patch) => setProfile((p) => ({ ...p, ...patch })), [])
  const updateCompany = useCallback((patch) => setCompany((p) => ({ ...p, ...patch })), [])
  const updateNotifPrefs = useCallback((patch) => setNotifPrefs((p) => ({ ...p, ...patch })), [])

  // Audit jurnali — faqat qo'shiladi, UI'dan o'chirish yo'q
  const audit = useCallback((action, entity) => {
    setAuditLog((p) => [{ id: uid('au'), at: new Date().toISOString(), by: 'Abdulaziz Yusupov', action, entity: entity || '' }, ...p].slice(0, 300))
  }, [])

  // global Ctrl+K
  useEffect(() => {
    const fn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const value = useMemo(() => ({
    clients, setClients, cases, setCases, payments, setPayments,
    events, setEvents, docs, setDocs, team, setTeam, convs, setConvs,
    notifs, setNotifs, toasts, toast, pushNotif, audit,
    tasks, setTasks, leads, setLeads, contracts, setContracts,
    expenses, setExpenses, timeLogs, setTimeLogs,
    auditLog, agent, setAgent, avatar, setAvatar,
    theme, setTheme, sidebarCollapsed, setSidebarCollapsed,
    cmdkOpen, setCmdkOpen,
    authed, login, logout, profile, setProfile, company, setCompany,
    notifPrefs, updateProfile, updateCompany, updateNotifPrefs
  }), [clients, cases, payments, events, docs, team, convs, notifs, toasts, theme, sidebarCollapsed, cmdkOpen, toast, pushNotif, audit,
    tasks, leads, contracts, expenses, timeLogs, auditLog, agent, avatar,
    authed, login, logout, profile, company, notifPrefs, updateProfile, updateCompany, updateNotifPrefs])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
