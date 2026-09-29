import { useState, useRef } from 'react'
import { Globe, FileUp, MessageSquare, ShieldCheck, Send } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Field } from '../components/ui/kit'
import { fmtMoney, fmtDate } from '../utils/format'

export default function ClientPortal() {
  const { clients, cases, payments, docs, setDocs, toast, audit, pushNotif } = useStore()
  const { t } = useLang()
  const [cid, setCid] = useState(clients[0]?.id || '')
  const [msg, setMsg] = useState('')
  const [requests, setRequests] = useState([{ id: 1, text: 'Shartnoma nusxasini portalga yuklashingizni so‘rayman', at: '2026-09-28', from: 'lawyer' }])
  const upRef = useRef(null)

  const c = clients.find((x) => x.id === cid)
  const kc = cases.filter((k) => k.clientId === cid)
  const kp = payments.filter((p) => p.clientId === cid)
  const kd = docs.filter((d) => d.clientId === cid)

  const send = () => {
    if (!msg.trim()) return
    setRequests([{ id: Date.now(), text: msg, at: '2026-09-29', from: 'client' }, ...requests])
    setMsg('')
    audit('Mijoz so‘rovi', msg)
    pushNotif({ type: 'message', title: 'Mijoz so‘rovi', text: `${c.name}: ${msg}` })
    toast('So‘rov yuborildi')
  }

  if (!c) return <div className="card p-10 text-center font-bold">Mijozlar yo‘q</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center"><Globe size={22} /></span>
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.portal.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.portal.s')}</p></div>
        <div className="flex-1" />
        <select className="input !w-auto" value={cid} onChange={(e) => setCid(e.target.value)}>
          {clients.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </div>

      <div className="rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/10 p-5 sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">Mijoz ko‘rinishi — {c.name}</p>
        <h2 className="font-display text-xl font-extrabold mt-1 dark:text-white">Xush kelibsiz, {c.name.split(' ')[0]}!</h2>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="card p-4"><p className="text-xs text-slate-400 font-semibold">Faol ishlar</p><p className="font-display text-xl font-extrabold dark:text-white">{kc.length}</p>{kc.slice(0, 2).map((k) => <p key={k.id} className="text-xs text-slate-500 truncate mt-1">{k.title}</p>)}</div>
          <div className="card p-4"><p className="text-xs text-slate-400 font-semibold">To‘lanishi kerak</p><p className="font-display text-xl font-extrabold dark:text-white">{fmtMoney(kp.filter((p) => p.status !== 'To‘langan').reduce((a, p) => a + p.amount, 0))}</p><p className="text-xs text-slate-500 mt-1">Oxirgi: {kp[0] ? fmtDate(kp[0].due) : '—'}</p></div>
          <div className="card p-4"><p className="text-xs text-slate-400 font-semibold">Hujjatlar</p><p className="font-display text-xl font-extrabold dark:text-white">{kd.length}</p>{kd.slice(0, 2).map((d) => <p key={d.id} className="text-xs text-slate-500 truncate mt-1">📄 {d.name}</p>)}</div>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <div className="card p-4">
            <h4 className="font-bold text-sm dark:text-white flex items-center gap-2"><MessageSquare size={15} /> So‘rovlar</h4>
            <div className="space-y-2 mt-2.5 max-h-[180px] overflow-y-auto scroll-thin">
              {requests.map((r) => (
                <div key={r.id} className={`text-[13px] p-2.5 rounded-xl ${r.from === 'client' ? 'bg-brand-50 dark:bg-brand-950/30 ml-6' : 'bg-slate-50 dark:bg-slate-800 mr-6'}`}>{r.text}<span className="block text-[10px] text-slate-400 mt-0.5">{r.at}</span></div>
              ))}
            </div>
            <div className="flex gap-2 mt-2.5"><input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Yuristga yozish…" className="input" /><button className="btn-primary !px-3.5" onClick={send}><Send size={15} /></button></div>
          </div>
          <div className="card p-4">
            <h4 className="font-bold text-sm dark:text-white flex items-center gap-2"><FileUp size={15} /> Xavfsiz fayl almashish</h4>
            <p className="text-xs text-slate-500 mt-1.5">Mijoz faqat o‘ziga tegishli fayllarni ko‘radi. Yuklangan fayl shu mijozga bog‘lanadi.</p>
            <div className="mt-2.5 space-y-1.5">{kd.map((d) => <p key={d.id} className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> {d.name}</p>)}
              {kd.length === 0 && <p className="text-xs text-slate-400">Hali fayl yo‘q</p>}</div>
            <input ref={upRef} type="file" className="hidden" onChange={(e) => {
              const f = e.target.files[0]
              if (!f) return
              setDocs((p) => [{ id: `doc-${Date.now()}`, name: f.name, category: 'Mijoz yuklagan', size: f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1024)) + ' KB', type: (f.name.split('.').pop() || 'file').toLowerCase(), clientId: cid, caseId: null, updated: new Date().toISOString().slice(0, 10), url: URL.createObjectURL(f), mime: f.type }, ...p])
              audit('Mijoz fayl yukladi', f.name)
              toast('Fayl yuklandi')
              e.target.value = ''
            }} />
            <button className="btn-ghost w-full mt-3 !py-2 !text-xs" onClick={() => upRef.current.click()}><FileUp size={14} /> Fayl yuklash</button>
          </div>
        </div>
      </div>
    </div>
  )
}
