import { useState } from 'react'
import { Workflow, Plus, Trash2, Zap } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Field, Empty } from '../components/ui/kit'
import { uid } from '../utils/format'

const TRIGGERS = ['Yangi lead', 'To‘lov kechikdi', 'Deadline 3 kun qoldi', 'Ish yopildi', 'Yangi hujjat']
const ACTIONS = ['Telegram xabarnoma', 'Vazifa yaratish', 'Email yuborish', 'Operatorga biriktirish']

export default function WorkflowPage() {
  const { toast, audit } = useStore()
  const { t } = useLang()
  const [rules, setRules] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lawcrm_flow') || 'null') || [
      { id: 'wf_1', trigger: 'To‘lov kechikdi', action: 'Telegram xabarnoma', on: true },
      { id: 'wf_2', trigger: 'Deadline 3 kun qoldi', action: 'Vazifa yaratish', on: true },
      { id: 'wf_3', trigger: 'Yangi lead', action: 'Operatorga biriktirish', on: false }
    ] } catch { return [] }
  })
  const [modal, setModal] = useState(false)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ trigger: TRIGGERS[0], action: ACTIONS[0] })

  const saveAll = (v) => { setRules(v); localStorage.setItem('lawcrm_flow', JSON.stringify(v)) }

  const create = () => {
    saveAll([{ id: uid('wf'), ...form, on: true }, ...rules])
    audit('Workflow qoida yaratildi', `${form.trigger} → ${form.action}`)
    toast('Qoida yaratildi')
    setModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center"><Workflow size={22} /></span>
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.workflow.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.workflow.s')}</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={17} /> Yangi qoida</button>
      </div>
      <div className="card p-4 space-y-2.5">
        {rules.map((r) => (
          <div key={r.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <button onClick={() => saveAll(rules.map((x) => x.id === r.id ? { ...x, on: !x.on } : x))}
              className={`w-11 h-6 rounded-full p-1 transition shrink-0 ${r.on ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
              <span className={`block w-4 h-4 rounded-full bg-white transition-all ${r.on ? 'ml-5' : ''}`} /></button>
            <span className="flex-1 flex flex-wrap items-center gap-2 text-sm font-bold dark:text-white">
              {r.trigger} <Zap size={14} className="text-amber-500" /> <span className="text-brand-600">{r.action}</span>
            </span>
            <button onClick={() => setDel(r)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={15} /></button>
          </div>
        ))}
        {rules.length === 0 && <Empty icon={<Workflow size={24} />} title="Qoida yo‘q" text="Birinchi avtomatlashtirishni yarating." />}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Yangi qoida" width="max-w-sm">
        <div className="space-y-4">
          <Field label="Hodisa (trigger)"><select className="input" value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })}>{TRIGGERS.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Harakat (action)"><select className="input" value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}>{ACTIONS.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={create}>{t('c.create')}</button></div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title={t('c.delete')} text={`${del?.trigger} → ${del?.action}`}
        onConfirm={() => { saveAll(rules.filter((x) => x.id !== del.id)); toast('O‘chirildi', 'info') }} />
    </div>
  )
}
