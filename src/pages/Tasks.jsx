import { useMemo, useState } from 'react'
import { Plus, Trash2, Search, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Badge, Empty, Field } from '../components/ui/kit'
import { fmtDate, uid } from '../utils/format'

const statuses = ['Yangi', 'Jarayonda', 'Bajarildi']

export default function Tasks() {
  const { tasks, setTasks, cases, team, toast, audit } = useStore()
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [f, setF] = useState('Barchasi')
  const [modal, setModal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ title: '', caseId: '', owner: '', priority: 'Medium', status: 'Yangi', deadline: '' })

  const rows = useMemo(() => tasks.filter((x) =>
    x.title.toLowerCase().includes(q.toLowerCase()) &&
    (f === 'Barchasi' || x.status === f || (f === 'Kechikkan' && x.status !== 'Bajarildi' && x.deadline < '2026-09-29'))
  ), [tasks, q, f])

  const overdue = (x) => x.status !== 'Bajarildi' && x.deadline && x.deadline < '2026-09-29'

  const save = () => {
    if (form.title.trim().length < 3) { toast('Vazifa nomi kiriting', 'error'); return }
    setTasks((p) => [{ id: uid('ts'), ...form }, ...p])
    audit('Vazifa yaratildi', form.title)
    toast('Vazifa yaratildi')
    setModal(false)
  }

  const cycle = (x) => {
    const nx = statuses[(statuses.indexOf(x.status) + 1) % statuses.length]
    setTasks((p) => p.map((t) => t.id === x.id ? { ...t, status: nx } : t))
    audit(`Vazifa holati: ${x.status} → ${nx}`, x.title)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.tasks.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.tasks.s')} • {tasks.filter(overdue).length} ta kechikkan</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => { setForm({ title: '', caseId: '', owner: '', priority: 'Medium', status: 'Yangi', deadline: '' }); setModal(true) }}><Plus size={17} /> {t('btn.newTask')}</button>
      </div>
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input !pl-10" placeholder={t('c.search')} />
          </div>
          <div className="flex gap-2 overflow-x-auto">{['Barchasi', ...statuses, 'Kechikkan'].map((s) => (
            <button key={s} onClick={() => setF(s)} className={`px-3.5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${f === s ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s}</button>
          ))}</div>
        </div>
        <div className="mt-3 overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[760px]">
            <thead><tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <th className="th">{t('th.title')}</th><th className="th">{t('th.case')}</th><th className="th">{t('th.owner')}</th>
              <th className="th">{t('th.priority')}</th><th className="th">{t('th.deadline')}</th><th className="th">{t('th.status')}</th><th className="th text-right">{t('c.actions')}</th>
            </tr></thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id} className={`border-b border-slate-50 dark:border-slate-800/60 hover:bg-brand-50/40 transition ${overdue(x) ? 'bg-red-50/40 dark:bg-red-950/10' : ''}`}>
                  <td className="td font-bold dark:text-white max-w-[260px]"><span className="flex items-center gap-2">{overdue(x) && <AlertTriangle size={15} className="text-red-500 shrink-0" />}<span className="truncate">{x.title}</span></span></td>
                  <td className="td text-xs text-slate-500 font-mono">{x.caseId || '—'}</td>
                  <td className="td text-slate-600 dark:text-slate-300">{x.owner || '—'}</td>
                  <td className="td"><Badge value={x.priority} /></td>
                  <td className="td text-slate-500">{fmtDate(x.deadline)}</td>
                  <td className="td"><button onClick={() => cycle(x)} title="Holatni almashtirish"><Badge value={x.status === 'Bajarildi' ? 'Yopilgan' : x.status === 'Jarayonda' ? 'Jarayonda' : 'Yangi'} /></button></td>
                  <td className="td text-right"><button onClick={() => setDel(x)} className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 text-slate-400"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <Empty icon={<Plus size={24} />} title="Vazifa topilmadi" text="Yangi vazifa yarating." />}
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={t('btn.newTask')}>
        <div className="space-y-4">
          <Field label={t('th.title') + ' *'}><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: Sudga hujjat topshirish" /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('th.case')}><select className="input" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}><option value="">—</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}</select></Field>
            <Field label={t('th.owner')}><select className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}><option value="">—</option>{team.map((x) => <option key={x.id} value={x.name}>{x.name}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('th.priority')}><select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{['Low', 'Medium', 'High', 'Urgent'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label={t('th.deadline')}><input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
          </div>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={save}>{t('c.create')}</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title={t('c.delete')} text={del?.title}
        onConfirm={() => { setTasks((p) => p.filter((x) => x.id !== del.id)); audit('Vazifa o‘chirildi', del.title); toast('Vazifa o‘chirildi', 'info') }} />
    </div>
  )
}
