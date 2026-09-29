import { useState } from 'react'
import { Bell, Send, CheckCheck, Trash2 } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Field, Confirm } from '../components/ui/kit'
import { telegramConfigured, sendTelegram, checkTelegram } from '../services/telegram'

export default function Notifications() {
  const { notifs, setNotifs, toast, pushNotif } = useStore()
  const { t } = useLang()
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lawcrm_notifprefs') || '{"tg":true,"email":false,"lead":true,"handoff":true,"payment":true,"deadline":true}') } catch { return { tg: true } }
  })
  const [testMsg, setTestMsg] = useState('LawCRM test xabari ✅')
  const [del, setDel] = useState(null)
  const [checking, setChecking] = useState(false)

  const savePrefs = (p) => { setPrefs(p); localStorage.setItem('lawcrm_notifprefs', JSON.stringify(p)) }

  const sendTest = async () => {
    setChecking(true)
    try {
      await sendTelegram(testMsg)
      toast('Telegram’ga yuborildi ✅')
      pushNotif({ type: 'appointment', title: 'Test xabarnoma', text: testMsg })
    } catch (e) {
      toast(e.message, 'error')
    }
    setChecking(false)
  }

  const check = async () => {
    setChecking(true)
    const r = await checkTelegram()
    toast(r.ok ? `Bot faol: @${r.username}` : r.reason, r.ok ? 'success' : 'error')
    setChecking(false)
  }

  const row = (k, label) => (
    <button key={k} onClick={() => savePrefs({ ...prefs, [k]: !prefs[k] })} className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-300 transition">
      <span className="text-sm font-bold dark:text-white">{label}</span>
      <span className={`w-11 h-6 rounded-full p-1 transition ${prefs[k] ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition-all ${prefs[k] ? 'ml-5' : ''}`} /></span>
    </button>
  )

  return (
    <div className="space-y-4">
      <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.notif.t')}</h1>
      <p className="text-sm text-slate-500">{t('pg.notif.s')}</p></div>
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold dark:text-white">So‘nggi hodisalar</h3>
            <button onClick={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))} className="text-xs font-bold text-brand-600 inline-flex items-center gap-1"><CheckCheck size={14} /> {t('hdr.markAll')}</button>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto scroll-thin">
            {notifs.map((n) => (
              <div key={n.id} className={`flex gap-3 p-3 rounded-2xl border transition ${n.read ? 'border-slate-100 dark:border-slate-800' : 'border-brand-200 bg-brand-50/40 dark:bg-brand-950/20'}`}>
                <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><Bell size={15} className="text-slate-500" /></span>
                <span className="flex-1 min-w-0"><span className="block text-[13px] font-bold dark:text-white">{n.title}</span>
                <span className="block text-xs text-slate-500 truncate">{n.text}</span><span className="text-[11px] text-slate-400">{n.time}</span></span>
                <button onClick={() => setDel(n)} className="p-1.5 text-slate-300 hover:text-red-500 self-start"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-bold dark:text-white mb-1">Telegram bot</h3>
            <p className="text-xs text-slate-400 mb-3">Status: {telegramConfigured() ? <b className="text-emerald-600">● ulangan</b> : <b className="text-amber-600">● sozlanmagan (.env)</b>}</p>
            <Field label="Test xabari"><input className="input" value={testMsg} onChange={(e) => setTestMsg(e.target.value)} /></Field>
            <div className="flex gap-2.5 mt-3">
              <button className="btn-primary flex-1" disabled={checking} onClick={sendTest}><Send size={15} /> Yuborish</button>
              <button className="btn-ghost flex-1" disabled={checking} onClick={check}>Bog‘lanishni tekshirish</button>
            </div>
            <p className="text-[11.5px] text-slate-400 mt-2.5">Token <code>.env</code> da saqlanadi (<code>VITE_TELEGRAM_BOT_TOKEN</code>), kodda yo‘q. Production'da proxy orqali yuboriladi.</p>
          </div>
          <div className="card p-5 space-y-2.5">
            <h3 className="font-display font-bold dark:text-white">Kanallar va hodisalar</h3>
            {row('tg', 'Telegram (xodimlarga bot)')}
            {row('email', 'Email (reseller domenidan)')}
            {row('lead', 'Issiq lead')}
            {row('handoff', 'Handoff — operatorga')}
            {row('payment', 'Yangi to‘lov')}
            {row('deadline', 'Deadline eslatma')}
          </div>
        </div>
      </div>
      <Confirm open={!!del} onClose={() => setDel(null)} title={t('c.delete')} text={del?.title}
        onConfirm={() => { setNotifs((p) => p.filter((x) => x.id !== del.id)); toast('O‘chirildi', 'info') }} />
    </div>
  )
}
