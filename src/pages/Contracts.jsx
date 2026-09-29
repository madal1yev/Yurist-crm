import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, PenLine } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Badge, Empty, Field } from '../components/ui/kit'
import { fmtMoney, fmtDate, uid } from '../utils/format'

export default function Contracts() {
  const { contracts, setContracts, clients, toast, audit } = useStore()
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [f, setF] = useState('Barchasi')
  const [modal, setModal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ title: '', clientId: '', amount: '', signed: '', expires: '', status: 'Faol', esign: 'Kutilmoqda' })

  const cname = (id) => clients.find((c) => c.id === id)?.name || '—'
  const rows = useMemo(() => contracts.filter((c) =>
    (c.title + ' ' + c.id).toLowerCase().includes(q.toLowerCase()) &&
    (f === 'Barchasi' || c.status === f)), [contracts, q, f])

  const save = () => {
    if (form.title.trim().length < 4 || !form.clientId) { toast('Nom va mijoz shart', 'error'); return }
    setContracts((p) => [{ id: `SH-2026-${String(Math.floor(Math.random() * 80) + 30).padStart(3, '0')}`, amount: Number(form.amount) || 0, ...form }, ...p])
    audit('Shartnoma yaratildi', form.title)
    toast('Shartnoma yaratildi')
    setModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.contracts.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.contracts.s')}</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => { setForm({ title: '', clientId: '', amount: '', signed: '', expires: '', status: 'Faol', esign: 'Kutilmoqda' }); setModal(true) }}><Plus size={17} /> {t('btn.newContract')}</button>
      </div>
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input !pl-10" placeholder={t('c.search')} />
          </div>
          <div className="flex gap-2">{['Barchasi', 'Faol', 'Muddati yaqin', 'Yakunlangan'].map((s) => (
            <button key={s} onClick={() => setF(s)} className={`px-3.5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${f === s ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s}</button>
          ))}</div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3.5 mt-4">
          {rows.map((c) => (
            <div key={c.id} className="card card-hover p-5">
              <div className="flex items-center gap-2"><span className="font-mono text-[11px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-lg">{c.id}</span><span className="flex-1" />
                <button onClick={() => setDel(c)} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button></div>
              <h3 className="font-bold text-[15px] mt-2 dark:text-white leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{cname(c.clientId)}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5"><p className="text-slate-400 font-semibold">Summa</p><p className="font-extrabold dark:text-white">{fmtMoney(c.amount)}</p></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5"><p className="text-slate-400 font-semibold">Tugaydi</p><p className="font-extrabold dark:text-white">{fmtDate(c.expires)}</p></div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge value={c.status === 'Faol' ? 'Faol' : c.status === 'Yakunlangan' ? 'Yopilgan' : 'Kutilmoqda'} />
                <span className="text-[11px] font-bold text-slate-400 inline-flex items-center gap-1"><PenLine size={12} /> {c.esign}</span>
              </div>
            </div>
          ))}
        </div>
        {rows.length === 0 && <Empty icon={<Plus size={24} />} title="Shartnoma topilmadi" text="Yangi shartnoma yarating." />}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={t('btn.newContract')}>
        <div className="space-y-4">
          <Field label={t('th.title') + ' *'}><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('th.client') + ' *'}><select className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}><option value="">Tanlang…</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label={t('th.amount')}><input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Imzolangan"><input type="date" className="input" value={form.signed} onChange={(e) => setForm({ ...form, signed: e.target.value })} /></Field>
            <Field label="Tugaydi"><input type="date" className="input" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} /></Field>
          </div>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={save}>{t('c.create')}</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title={t('c.delete')} text={del?.title}
        onConfirm={() => { setContracts((p) => p.filter((x) => x.id !== del.id)); audit('Shartnoma o‘chirildi', del.title); toast('O‘chirildi', 'info') }} />
    </div>
  )
}
