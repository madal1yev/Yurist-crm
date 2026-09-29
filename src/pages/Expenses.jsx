import { useState } from 'react'
import { Plus, Trash2, Clock } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Field } from '../components/ui/kit'
import { fmtMoney, fmtDate, uid } from '../utils/format'

export default function Expenses() {
  const { expenses, setExpenses, timeLogs, setTimeLogs, cases, team, toast, audit } = useStore()
  const { t } = useLang()
  const [tab, setTab] = useState('exp')
  const [modal, setModal] = useState(false)
  const [tmodal, setTmodal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ title: '', category: 'Sud xarajatlari', amount: '', date: '', caseId: '' })
  const [tf, setTf] = useState({ title: '', caseId: '', owner: '', hours: '', rate: '', date: '' })

  const totalExp = expenses.reduce((a, e) => a + Number(e.amount || 0), 0)
  const totalTime = timeLogs.reduce((a, x) => a + Number(x.hours || 0) * Number(x.rate || 0), 0)

  const saveExp = () => {
    if (!form.title.trim() || !form.amount) { toast('Nom va summa shart', 'error'); return }
    setExpenses((p) => [{ id: uid('ex'), amount: Number(form.amount), ...form }, ...p])
    audit('Xarajat qo‘shildi', form.title)
    toast('Xarajat qo‘shildi'); setModal(false)
  }
  const saveTime = () => {
    if (!tf.title.trim() || !tf.hours) { toast('Ish va soat shart', 'error'); return }
    setTimeLogs((p) => [{ id: uid('tl'), hours: Number(tf.hours), rate: Number(tf.rate) || 0, ...tf }, ...p])
    audit('Vaqt yozuvi qo‘shildi', tf.title)
    toast('Vaqt yozildi'); setTmodal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.expenses.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.expenses.s')}</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => tab === 'exp' ? setModal(true) : setTmodal(true)}><Plus size={17} /> {tab === 'exp' ? t('btn.newExpense') : 'Vaqt yozish'}</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5"><p className="text-xs font-medium text-slate-500">Jami xarajat</p><p className="font-display text-xl font-extrabold dark:text-white">{fmtMoney(totalExp)}</p></div>
        <div className="card p-5"><p className="text-xs font-medium text-slate-500">Vaqt qiymati</p><p className="font-display text-xl font-extrabold dark:text-white">{fmtMoney(totalTime)}</p></div>
      </div>
      <div className="card p-2">
        <div className="flex gap-1 p-2">
          {[['exp', 'Xarajatlar'], ['time', 'Vaqt hisobi']].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition ${tab === v ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{l}</button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          {tab === 'exp' && expenses.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="flex-1 min-w-0"><span className="block text-sm font-bold truncate dark:text-white">{e.title}</span>
              <span className="block text-xs text-slate-400">{e.category} • {e.caseId || '—'} • {fmtDate(e.date)}</span></span>
              <b className="dark:text-white">{fmtMoney(e.amount)}</b>
              <button onClick={() => setDel({ kind: 'exp', ...e })} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={15} /></button>
            </div>
          ))}
          {tab === 'time' && timeLogs.map((x) => (
            <div key={x.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center"><Clock size={16} /></span>
              <span className="flex-1 min-w-0"><span className="block text-sm font-bold truncate dark:text-white">{x.title}</span>
              <span className="block text-xs text-slate-400">{x.owner} • {x.hours} soat × {fmtMoney(x.rate)} • {fmtDate(x.date)}</span></span>
              <b className="dark:text-white">{fmtMoney(Number(x.hours) * Number(x.rate))}</b>
              <button onClick={() => setDel({ kind: 'time', ...x })} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={t('btn.newExpense')}>
        <div className="space-y-4">
          <Field label="Nomi *"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategoriya"><select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Sud xarajatlari', 'Transport', 'Hujjatlar', 'Ofis', 'Boshqa'].map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Summa *"><input type="number" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sana"><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Ish"><select className="input" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}><option value="">—</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}</select></Field>
          </div>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={saveExp}>{t('c.create')}</button></div>
        </div>
      </Modal>
      <Modal open={tmodal} onClose={() => setTmodal(false)} title="Vaqt yozish">
        <div className="space-y-4">
          <Field label="Bajarilgan ish *"><input className="input" value={tf.title} onChange={(e) => setTf({ ...tf, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ish"><select className="input" value={tf.caseId} onChange={(e) => setTf({ ...tf, caseId: e.target.value })}><option value="">—</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}</select></Field>
            <Field label="Xodim"><select className="input" value={tf.owner} onChange={(e) => setTf({ ...tf, owner: e.target.value })}><option value="">—</option>{team.map((x) => <option key={x.id} value={x.name}>{x.name}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Soat *"><input type="number" className="input" value={tf.hours} onChange={(e) => setTf({ ...tf, hours: e.target.value })} /></Field>
            <Field label="Tarif/soat"><input type="number" className="input" value={tf.rate} onChange={(e) => setTf({ ...tf, rate: e.target.value })} /></Field>
            <Field label="Sana"><input type="date" className="input" value={tf.date} onChange={(e) => setTf({ ...tf, date: e.target.value })} /></Field>
          </div>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setTmodal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={saveTime}>{t('c.save')}</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title={t('c.delete')} text={del?.title}
        onConfirm={() => { del.kind === 'exp' ? setExpenses((p) => p.filter((x) => x.id !== del.id)) : setTimeLogs((p) => p.filter((x) => x.id !== del.id)); toast('O‘chirildi', 'info') }} />
    </div>
  )
}
