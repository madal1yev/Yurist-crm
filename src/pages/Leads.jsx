import { useState } from 'react'
import { Plus, ArrowRight, Trash2, Phone } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Field } from '../components/ui/kit'
import { uid } from '../utils/format'

const stages = ['Yangi', 'Bog‘lanildi', 'Uchrashuv', 'Mijoz']

export default function Leads() {
  const { leads, setLeads, setClients, clients, toast, audit, pushNotif } = useStore()
  const { t } = useLang()
  const [modal, setModal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', source: 'Telegram', status: 'Yangi', note: '' })

  const save = () => {
    if (form.name.trim().length < 3 || !form.phone.trim()) { toast('Ism va telefon shart', 'error'); return }
    setLeads((p) => [{ id: uid('ld'), created: new Date().toISOString().slice(0, 10), ...form }, ...p])
    audit('Murojaat yaratildi', form.name)
    setModal(false)
    toast('Murojaat qo‘shildi')
  }

  const move = (l, dir) => {
    const i = stages.indexOf(l.status)
    const ni = Math.min(stages.length - 1, Math.max(0, i + dir))
    setLeads((p) => p.map((x) => x.id === l.id ? { ...x, status: stages[ni] } : x))
  }

  const convert = (l) => {
    if (clients.some((c) => c.phone === l.phone)) { toast('Bu telefon bilan mijoz bor', 'error'); return }
    const nc = { id: uid('cl'), name: l.name, phone: l.phone, email: '', address: '', status: 'Faol', tags: ['Yangi'], birth: '', notes: l.note || '', createdAt: new Date().toISOString().slice(0, 10) }
    setClients((p) => [nc, ...p])
    setLeads((p) => p.map((x) => x.id === l.id ? { ...x, status: 'Mijoz' } : x))
    audit('Lead mijozga aylantirildi', l.name)
    pushNotif({ type: 'client', title: 'Lead mijoz bo‘ldi', text: l.name })
    toast('Mijozga aylantirildi 🎉')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.leads.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.leads.s')}</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => { setForm({ name: '', phone: '', source: 'Telegram', status: 'Yangi', note: '' }); setModal(true) }}><Plus size={17} /> {t('btn.newLead')}</button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3.5 items-start">
        {stages.map((s) => (
          <div key={s} className="card p-3 bg-slate-50/50 dark:bg-slate-900">
            <p className="font-bold text-[13px] px-1.5 pb-2 dark:text-white flex items-center justify-between">{s}
              <span className="text-[11px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-2 py-0.5 rounded-full">{leads.filter((l) => l.status === s).length}</span></p>
            <div className="space-y-2.5">
              {leads.filter((l) => l.status === s).map((l) => (
                <div key={l.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700 p-3.5 shadow-card">
                  <p className="text-sm font-bold dark:text-white">{l.name}</p>
                  <a href={`tel:${l.phone.replace(/\s/g, '')}`} className="text-xs text-brand-600 font-bold inline-flex items-center gap-1 mt-0.5"><Phone size={11} /> {l.phone}</a>
                  <p className="text-[11.5px] text-slate-400 mt-1">{l.source} • {l.created}</p>
                  {l.note && <p className="text-xs text-slate-500 mt-1">{l.note}</p>}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <button onClick={() => move(l, -1)} disabled={s === stages[0]} className="px-2 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 disabled:opacity-30">←</button>
                    <button onClick={() => move(l, 1)} disabled={s === stages[stages.length - 1]} className="px-2 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 disabled:opacity-30">→</button>
                    <span className="flex-1" />
                    {s !== 'Mijoz' && <button onClick={() => convert(l)} className="px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1">Mijoz <ArrowRight size={12} /></button>}
                    <button onClick={() => setDel(l)} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={t('btn.newLead')}>
        <div className="space-y-4">
          <Field label={t('c.name') + ' *'}><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('th.phone') + ' *'}><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 ..." /></Field>
            <Field label="Manba"><select className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>{['Telegram', 'Instagram', 'Sayt', 'Tavsiya', 'Qo‘ng‘iroq'].map((s) => <option key={s}>{s}</option>)}</select></Field>
          </div>
          <Field label="Izoh"><input className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={save}>{t('c.create')}</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title={t('c.delete')} text={del?.name}
        onConfirm={() => { setLeads((p) => p.filter((x) => x.id !== del.id)); toast('O‘chirildi', 'info') }} />
    </div>
  )
}
