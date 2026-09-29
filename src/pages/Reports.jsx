import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { fmtMoney, exportCSV } from '../utils/format'

export default function Reports() {
  const { payments, cases, clients, expenses, toast } = useStore()
  const { t } = useLang()
  const [kind, setKind] = useState('Moliyaviy')

  const paid = payments.filter((p) => p.status === 'To‘langan')
  const data = useMemo(() => {
    if (kind === 'Moliyaviy') {
      const by = {}
      paid.forEach((p) => { const m = (p.date || '').slice(0, 7); by[m] = (by[m] || 0) + p.amount })
      return Object.entries(by).map(([m, sum]) => ({ name: m || '—', sum }))
    }
    if (kind === 'Ishlar') {
      const by = {}
      cases.forEach((c) => { by[c.status] = (by[c.status] || 0) + 1 })
      return Object.entries(by).map(([name, sum]) => ({ name, sum }))
    }
    const by = {}
    clients.forEach((c) => { by[c.status] = (by[c.status] || 0) + 1 })
    return Object.entries(by).map(([name, sum]) => ({ name, sum }))
  }, [kind, payments, cases, clients, paid])

  const summary = [
    ['Jami tushum', fmtMoney(paid.reduce((a, p) => a + p.amount, 0))],
    ['Jami xarajat', fmtMoney(expenses.reduce((a, e) => a + Number(e.amount || 0), 0))],
    ['Faol ishlar', cases.filter((c) => c.status !== 'Yopilgan').length + ' ta'],
    ['Jami mijozlar', clients.length + ' ta']
  ]

  const doExport = () => {
    const ok = exportCSV(`hisobot-${kind}.csv`, data.map((d) => ({ kategoriya: d.name, qiymat: d.sum })))
    toast(ok ? 'CSV yuklab olindi' : 'Ma’lumot yo‘q', ok ? 'success' : 'error')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.reports.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.reports.s')}</p></div>
        <div className="flex-1" />
        <div className="flex gap-2">{['Moliyaviy', 'Ishlar', 'Mijozlar'].map((k) => (
          <button key={k} onClick={() => setKind(k)} className={`px-3.5 py-2 rounded-xl text-[13px] font-bold transition ${kind === k ? 'bg-brand-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500'}`}>{k}</button>
        ))}</div>
        <button className="btn-primary" onClick={doExport}><Download size={16} /> {t('c.export')}</button>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summary.map(([l, v]) => (
          <div key={l} className="card p-4"><p className="text-xs text-slate-500">{l}</p><p className="font-display text-lg font-extrabold dark:text-white">{v}</p></div>
        ))}
      </div>
      <div className="card p-5">
        <h3 className="font-display font-bold text-[15px] dark:text-white">{kind} kesimida</h3>
        <div className="h-[260px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => kind === 'Moliyaviy' ? fmtMoney(v) : v} contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="sum" fill="#2563eb" radius={[6, 6, 2, 2]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
