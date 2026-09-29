import { useState } from 'react'
import { PenLine, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Badge, Field, Empty } from '../components/ui/kit'
import { fmtDate, uid } from '../utils/format'

export default function ESign() {
  const { contracts, clients, toast, audit } = useStore()
  const { t } = useLang()
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lawcrm_esign') || 'null') || [
      { id: 'es_1', doc: 'SH-2026-021 — Retainer', signer: 'Sardor Usmonov', status: 'Imzolangan', at: '2026-09-05' },
      { id: 'es_2', doc: 'SH-2026-009 — Konsultatsiya', signer: 'Jasur Hakimov', status: 'Kutilmoqda', at: '' }
    ] } catch { return [] }
  })
  const [modal, setModal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ doc: '', signer: '' })

  const saveAll = (v) => { setItems(v); localStorage.setItem('lawcrm_esign', JSON.stringify(v)) }
  const cname = (id) => clients.find((c) => c.id === id)?.name || ''

  const create = () => {
    if (!form.doc || !form.signer.trim()) { toast('Hujjat va imzolovchi shart', 'error'); return }
    saveAll([{ id: uid('es'), ...form, status: 'Kutilmoqda', at: '' }, ...items])
    audit('E-imzo so‘rovi yuborildi', form.doc)
    toast('Imzo so‘rovi yuborildi')
    setModal(false)
  }
  const sign = (it) => {
    saveAll(items.map((x) => x.id === it.id ? { ...x, status: 'Imzolangan', at: new Date().toISOString().slice(0, 10) } : x))
    audit('Hujjat imzolandi', it.doc)
    toast('Hujjat imzolandi ✅')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center"><PenLine size={22} /></span>
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.esign.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.esign.s')} • E-IMZO / OneID provayderiga ulanishga tayyor</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => { setForm({ doc: '', signer: '' }); setModal(true) }}><Plus size={17} /> Imzoga yuborish</button>
      </div>
      <div className="card p-4 space-y-2.5">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${it.status === 'Imzolangan' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {it.status === 'Imzolangan' ? <CheckCircle2 size={18} /> : <Clock size={18} />}</span>
            <span className="flex-1 min-w-0"><span className="block text-sm font-bold truncate dark:text-white">{it.doc}</span>
            <span className="block text-xs text-slate-400">{it.signer} {it.at && '• ' + fmtDate(it.at)}</span></span>
            <Badge value={it.status === 'Imzolangan' ? 'To‘langan' : 'Kutilmoqda'} />
            {it.status !== 'Imzolangan' && <button onClick={() => sign(it)} className="btn-primary !py-2 !px-3.5 !text-xs">Imzolash</button>}
            <button onClick={() => setDel(it)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={15} /></button>
          </div>
        ))}
        {items.length === 0 && <Empty icon={<PenLine size={24} />} title="So‘rov yo‘q" text="Hujjatni imzoga yuboring." />}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Imzoga yuborish" width="max-w-sm">
        <div className="space-y-4">
          <Field label="Shartnoma"><select className="input" value={form.doc} onChange={(e) => setForm({ ...form, doc: e.target.value, signer: cname(clients.find((c) => c.id === contracts.find((x) => x.id === e.target.value)?.clientId)?.id) || form.signer })}><option value="">Tanlang…</option>{contracts.map((c) => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 30)}</option>)}</select></Field>
          <Field label="Imzolovchi"><input className="input" value={form.signer} onChange={(e) => setForm({ ...form, signer: e.target.value })} placeholder="F.I.Sh" /></Field>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={create}>{t('c.send')}</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title={t('c.delete')} text={del?.doc}
        onConfirm={() => { saveAll(items.filter((x) => x.id !== del.id)); toast('O‘chirildi', 'info') }} />
    </div>
  )
}
