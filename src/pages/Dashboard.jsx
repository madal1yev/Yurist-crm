import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Scale, CreditCard, Hourglass, ArrowUpRight, ArrowDownRight, CalendarDays, Plus, FileText, UserPlus, Wallet, ChevronRight, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { fmtMoney, fmtCompact, initials, avatarColor } from '../utils/format'
import { Badge } from '../components/ui/kit'
import { revenueSeries, caseStatusData, clientGrowth, activityFeed } from '../data/mockData'

const COLORS = ['#2563eb', '#6366f1', '#8b5cf6', '#f59e0b', '#10b981']

export default function Dashboard() {
  const { clients, cases, payments, events } = useStore()

  const totalRevenue = payments.filter((p) => p.status === 'To‘langan').reduce((a, p) => a + p.amount, 0)
  const pending = payments.filter((p) => p.status !== 'To‘langan').reduce((a, p) => a + p.amount, 0)

  const stats = [
    { icon: Users, label: 'Jami mijozlar', value: clients.length * 9 + 10, delta: '+12.5%', up: true, color: 'bg-blue-500', data: clientGrowth.map((c) => ({ v: c.mijozlar })) },
    { icon: Scale, label: 'Faol ishlar', value: cases.filter((c) => c.status !== 'Yopilgan').length + 35, delta: '+8.2%', up: true, color: 'bg-indigo-500', data: [{ v: 20 }, { v: 26 }, { v: 24 }, { v: 32 }, { v: 38 }, { v: 43 }] },
    { icon: CreditCard, label: 'Jami to‘lovlar', value: totalRevenue, money: true, delta: '+18.4%', up: true, color: 'bg-emerald-500', data: revenueSeries.map((r) => ({ v: r.daromad / 1000000 })) },
    { icon: Hourglass, label: 'Kutilayotgan', value: pending, money: true, delta: '-3.1%', up: false, color: 'bg-amber-500', data: [{ v: 30 }, { v: 28 }, { v: 33 }, { v: 29 }, { v: 26 }, { v: 24 }] }
  ]

  const todayEvents = useMemo(() => events.filter((e) => e.date === '2026-09-29'), [events])

  return (
    <div className="space-y-5">
      {/* welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700 text-white p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-20 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute right-8 top-8 hidden md:block text-white/20"><Scale size={120} strokeWidth={1} /></div>
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">29-sentabr, seshanba • Toshkent</p>
          <h1 className="font-display text-2xl sm:text-[28px] font-extrabold mt-1 tracking-tight">Assalomu alaykum, Abdulaziz! 👋</h1>
          <p className="text-blue-100/90 text-sm mt-1.5 max-w-lg">Bugun sizda <b className="text-white">{todayEvents.length} ta uchrashuv</b>, 5 ta vazifa va 2 ta yangi mijoz bor. Omadli kun tilaymiz!</p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link to="/calendar" className="inline-flex items-center gap-2 bg-white text-brand-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition active:scale-95"><Plus size={16} /> Uchrashuv belgilash</Link>
            <Link to="/clients" className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-white/25 transition active:scale-95 border border-white/20"><UserPlus size={16} /> Yangi mijoz</Link>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card card-hover p-5">
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg`}><s.icon size={20} /></div>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${s.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{s.delta}
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mt-3">{s.label}</p>
            <p className="font-display text-[22px] font-extrabold text-slate-900 dark:text-white tracking-tight">{s.money ? fmtCompact(s.value) + " so'm" : s.value}</p>
            <div className="h-10 mt-1 -mb-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.data}>
                  <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} fill="#2563eb22" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div><h3 className="font-display font-bold text-[15px] dark:text-white">Daromad dinamikasi</h3><p className="text-xs text-slate-400">So‘nggi 6 oy • UZS</p></div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-brand-600" /> Daromad</span>
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Xarajat</span>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => (v / 1000000) + 'M'} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={{ borderRadius: 14, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Area type="monotone" dataKey="daromad" stroke="#2563eb" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="xarajat" stroke="#cbd5e1" strokeWidth={2} fill="#f1f5f9" />
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} /></linearGradient></defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-display font-bold text-[15px] dark:text-white">Ish holatlari</h3>
          <p className="text-xs text-slate-400 mb-2">Jami 97 ta ish</p>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={caseStatusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                  {caseStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {caseStatusData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />{c.name} <b className="text-slate-700 dark:text-slate-200 ml-auto">{c.value}</b></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* activity */}
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[15px] dark:text-white">So‘nggi faollik</h3>
            <Link to="/analytics" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">Barchasi <ChevronRight size={14} /></Link>
          </div>
          <div className="space-y-1">
            {activityFeed.map((a) => (
              <div key={a.id} className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${a.color === 'blue' ? 'bg-blue-50 text-blue-600' : a.color === 'violet' ? 'bg-violet-50 text-violet-600' : a.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : a.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {a.icon === 'user' ? <UserPlus size={17} /> : a.icon === 'file' ? <FileText size={17} /> : a.icon === 'card' ? <Wallet size={17} /> : a.icon === 'cal' ? <CalendarDays size={17} /> : <Scale size={17} />}
                </div>
                <p className="flex-1 text-[13.5px] font-medium text-slate-700 dark:text-slate-200">{a.text}</p>
                <span className="text-[11.5px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1"><Clock size={12} />{a.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mijozlar o‘sishi</h4>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientGrowth}>
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                  <Bar dataKey="mijozlar" fill="#2563eb" radius={[6, 6, 2, 2]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* upcoming */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-[15px] dark:text-white">Bugungi uchrashuvlar</h3>
            <Link to="/calendar" className="text-xs font-bold text-brand-600 hover:underline">Kalendar</Link>
          </div>
          <div className="space-y-3">
            {todayEvents.map((e) => (
              <div key={e.id} className="flex gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 hover:shadow-card transition">
                <div className="text-center bg-brand-50 dark:bg-slate-800 rounded-xl px-2.5 py-1.5 shrink-0">
                  <p className="text-[15px] font-extrabold text-brand-700 leading-none">{e.start}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{e.end}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold truncate dark:text-white">{e.title}</p>
                  <p className="text-[11.5px] text-slate-400 truncate">{e.location}</p>
                  <Badge value={e.type === 'Sud' ? 'Sudda' : e.type === 'Deadline' ? 'Urgent' : 'Jarayonda'} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Top mijozlar</h4>
            {clients.slice(0, 3).map((c) => (
              <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center gap-2.5 py-1.5 group">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${avatarColor(c.name)}`}>{initials(c.name)}</span>
                <span className="flex-1 text-[13px] font-bold group-hover:text-brand-600 truncate dark:text-slate-200">{c.name}</span>
                <Badge value={c.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
