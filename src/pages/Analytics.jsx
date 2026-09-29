import { useState } from 'react'
import { Download } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { revenueSeries, caseStatusData, clientGrowth } from '../data/mockData'
import { fmtMoney, initials, avatarColor, exportCSV } from '../utils/format'

const COLORS = ['#2563eb', '#6366f1', '#8b5cf6', '#f59e0b', '#10b981']
const lawyerPerf = [
  { name: 'A. Yusupov', ishlar: 14, yutuq: 13 }, { name: 'M. Rahimova', ishlar: 11, yutuq: 10 },
  { name: 'J. Toshpo‘latov', ishlar: 8, yutuq: 6 }, { name: 'S. Olimova', ishlar: 5, yutuq: 4 }
]
const caseTypes = [
  { name: 'Fuqarolik', value: 32 }, { name: 'Shartnoma', value: 24 },
  { name: 'Oilaviy', value: 18 }, { name: 'Mehnat', value: 14 }, { name: 'Jinoyat', value: 9 }
]

export default function Analytics() {
  const { team, toast } = useStore()
  const { t } = useLang()
  const [range, setRange] = useState('30 kun')

  const Card = ({ title, sub, children }) => (
    <div className="card p-5"><h3 className="font-display font-bold text-[15px] dark:text-white">{title}</h3>{sub && <p className="text-xs text-slate-400 mb-2">{sub}</p>}<div className="mt-2">{children}</div></div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.analytics.t')}</h1><p className="text-sm text-slate-500">{t('pg.analytics.s')}</p></div>
        <div className="flex-1" />
        <div className="flex gap-2 overflow-x-auto">{['Bugun', '7 kun', '30 kun', '3 oy', '1 yil'].map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`px-3.5 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${range === r ? 'bg-brand-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500'}`}>{r}</button>
        ))}</div>
        <button className="btn-primary" onClick={() => {
          exportCSV('daromad.csv', revenueSeries.map((r) => ({ oy: r.m, daromad: r.daromad, xarajat: r.xarajat })))
          toast('Excel hisobot yuklab olindi')
        }}><Download size={16} /> {t('c.export')}</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Oylik daromad" sub={`${range} • UZS`}>
          <div className="h-[240px]"><ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries}><XAxis dataKey="m" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => (v / 1e6) + 'M'} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(v) => fmtMoney(v)} contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Area type="monotone" dataKey="daromad" stroke="#2563eb" strokeWidth={2.5} fill="#2563eb33" /></AreaChart>
          </ResponsiveContainer></div>
        </Card>
        <Card title="Yangi mijozlar" sub="So‘nggi 6 oy">
          <div className="h-[240px]"><ResponsiveContainer width="100%" height="100%">
            <LineChart data={clientGrowth}><XAxis dataKey="m" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Line type="monotone" dataKey="mijozlar" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} /></LineChart>
          </ResponsiveContainer></div>
        </Card>
        <Card title="Ish turlari" sub="Foizda taqsimot">
          <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={caseTypes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
              {caseTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} /></PieChart>
          </ResponsiveContainer></div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1">{caseTypes.map((c, i) => <span key={c.name} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />{c.name} ({c.value}%)</span>)}</div>
        </Card>
        <Card title="Yuristlar samaradorligi" sub="Ishlar vs yutuqlar">
          <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={lawyerPerf} layout="vertical"><XAxis type="number" hide /><YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="ishlar" fill="#cbd5e1" radius={[0, 6, 6, 0]} barSize={12} /><Bar dataKey="yutuq" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={12} /></BarChart>
          </ResponsiveContainer></div>
        </Card>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-bold text-[15px] dark:text-white mb-3">Jamoa reytingi</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {team.slice(0, 4).map((t, i) => (
            <div key={t.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-display font-extrabold text-slate-300 text-lg">0{i + 1}</span>
              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(t.name)}`}>{initials(t.name)}</span>
              <div className="min-w-0"><p className="text-[13px] font-bold truncate dark:text-white">{t.name}</p><p className="text-[11px] text-emerald-600 font-bold">{t.winRate}% win rate</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
