import { useMemo, useState } from 'react'
import { Search, ScrollText, ShieldAlert } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Empty } from '../components/ui/kit'

export default function AuditLog() {
  const { auditLog } = useStore()
  const { t } = useLang()
  const [q, setQ] = useState('')

  const rows = useMemo(() => auditLog.filter((a) =>
    (a.action + ' ' + a.entity + ' ' + a.by).toLowerCase().includes(q.toLowerCase())), [auditLog, q])

  return (
    <div className="space-y-4">
      <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.audit.t')}</h1>
      <p className="text-sm text-slate-500">{t('pg.audit.s')} • yozuvlar faqat qo‘shiladi, o‘chirish mumkin emas</p></div>
      <div className="card p-4">
        <div className="relative max-w-md">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input !pl-10" placeholder={t('c.search')} />
        </div>
        <div className="mt-3 overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[680px]">
            <thead><tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th className="th">Vaqt</th><th className="th">Foydalanuvchi</th><th className="th">Harakat</th><th className="th">Obyekt</th>
            </tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 dark:border-slate-800/60">
                  <td className="td text-slate-500 text-xs">{new Date(a.at).toLocaleString('uz-UZ')}</td>
                  <td className="td font-bold dark:text-white">{a.by}</td>
                  <td className="td"><span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 dark:text-slate-300"><ShieldAlert size={13} className="text-slate-300" />{a.action}</span></td>
                  <td className="td text-slate-500">{a.entity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <Empty icon={<ScrollText size={24} />} title="Hali yozuv yo‘q" text="Tizimda biror amal bajaring — u shu yerda ko‘rinadi." />}
        </div>
      </div>
    </div>
  )
}
