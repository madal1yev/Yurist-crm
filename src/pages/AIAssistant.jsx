import { useMemo, useRef, useState, useEffect } from 'react'
import { Bot, Send, Cpu, Brain, Clock, MessageSquare, CheckCheck } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Field, Modal } from '../components/ui/kit'
import { fmtMoney, fmtDate, uid } from '../utils/format'
import { telegramConfigured, sendTelegram } from '../services/telegram'

export default function AIAssistant() {
  const { agent, setAgent, clients, cases, payments, events, tasks, toast, audit, pushNotif } = useStore()
  const { t } = useLang()
  const [tab, setTab] = useState('chat')
  const [q, setQ] = useState('')
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: 'Assalomu alaykum! Men «Yurist agent»man. Mijoz, ish, to‘lov yoki bugungi reja haqida so‘rang — tizimdagi real ma’lumotdan javob beraman.' }
  ])
  const [memText, setMemText] = useState('')
  const [cronModal, setCronModal] = useState(false)
  const [cronForm, setCronForm] = useState({ title: '', schedule: '' })
  const bottom = useRef(null)
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, tab])

  const answer = (text) => {
    const s = text.toLowerCase()
    const has = (...ws) => ws.some((w) => s.includes(w))
    // mijoz qidirish
    const found = clients.filter((c) => s.includes(c.name.toLowerCase().split(' ')[0]) && c.name.length > 3)
    if (has('mijoz', 'klient', 'клиент', 'müvekkil') && (has('nechta', 'soni', 'skolko', 'kaç', 'jami', 'ro‘yxat'))) {
      return `Tizimda ${clients.length} ta mijoz bor. Faollari: ${clients.filter((c) => c.status === 'Faol').length} ta. Eng so‘nggisi — ${clients[0]?.name} (${clients[0]?.phone}).`
    }
    if (found.length) {
      const c = found[0]
      const kc = cases.filter((k) => k.clientId === c.id)
      return `${c.name} — ${c.phone}, status: ${c.status}. Ishlari: ${kc.length ? kc.map((k) => k.id).join(', ') : 'yo‘q'}. Manzil: ${c.address || '—'}.`
    }
    if (has('to‘lov', 'tushum', 'qarzdor', 'oplata', 'ödeme', 'pul')) {
      const paid = payments.filter((p) => p.status === 'To‘langan').reduce((a, p) => a + p.amount, 0)
      const debt = payments.filter((p) => p.status !== 'To‘langan')
      return `Jami tushum: ${fmtMoney(paid)}. Kutilayotgan/kechikkan: ${debt.length} ta hisob — ${fmtMoney(debt.reduce((a, p) => a + p.amount, 0))}. ${debt.length ? 'Eng dolzarbi: ' + debt[0].id + ' (' + fmtMoney(debt[0].amount) + ').' : ''}`
    }
    if (has('bugun', 'reja', 'uchrashuv', 'segodnya', 'bugün', 'deadline', 'dedlayn', 'sud')) {
      const today = events.filter((e) => e.date === '2026-09-29')
      const od = tasks.filter((x) => x.status !== 'Bajarildi' && x.deadline && x.deadline <= '2026-09-30')
      return `Bugun ${today.length} ta tadbir: ${today.map((e) => e.start + ' ' + e.title).join('; ') || '—'}. Dolzarb vazifalar: ${od.length ? od.map((x) => x.title).join('; ') : 'yo‘q'}.`
    }
    if (has('ish', 'case', 'delo', 'dava') && has('nechta', 'skolko', 'kaç', 'soni', 'faol')) {
      const act = cases.filter((c) => c.status !== 'Yopilgan')
      return `Jami ${cases.length} ta ish, shundan faol: ${act.length} ta. Urgent: ${cases.filter((c) => c.priority === 'Urgent').length} ta.`
    }
    if (has('shartnoma', 'dogovor', 'sözleşme', 'loyiha', 'hujjat', 'tayyorla')) {
      return 'Hujjat loyihasi tayyorlash uchun: Shartnomalar sahifasida mijozni tanlang, summa va muddatni kiriting — shablon avtomatik to‘ladi. Muhim: har qanday AI loyihani yurist tekshirib, tasdiqlashi shart.'
    }
    if (has('salom', 'assalom', 'privet', 'merhaba', 'hello')) return 'Va alaykum assalom! Qanday yordam beray — mijoz, ish, to‘lov yoki bugungi rejami?'
    if (has('rahmat', 'spasibo', 'teşekkür')) return 'Arzimaydi! Yana savol bo‘lsa — shu yerdaman. 🙂'
    return 'Tizimda bu bo‘yicha aniq ma’lumot topilmadi. «Mijozlar», «Ishlar», «To‘lovlar» yoki «bugungi reja» deb so‘rab ko‘ring — real ma’lumotdan javob beraman. (Uydirma raqam aytmayman.)'
  }

  const send = () => {
    if (!q.trim()) return
    const user = q
    setMsgs((p) => [...p, { from: 'me', text: user }])
    setQ('')
    setTimeout(() => setMsgs((p) => [...p, { from: 'bot', text: answer(user) }]), 500)
  }

  const toggleSkill = (id) => setAgent({ ...agent, skills: agent.skills.map((s) => s.id === id ? { ...s, on: !s.on } : s) })
  const toggleCron = (id) => setAgent({ ...agent, cron: agent.cron.map((c) => c.id === id ? { ...c, on: !c.on } : c) })
  const addMem = () => {
    if (!memText.trim()) return
    setAgent({ ...agent, memory: [{ id: uid('mm'), kind: 'session', text: memText, date: new Date().toISOString().slice(0, 10) }, ...agent.memory] })
    setMemText('')
    toast('Xotiraga yozildi')
  }
  const addCron = () => {
    if (!cronForm.title.trim()) { toast('Nom kiriting', 'error'); return }
    setAgent({ ...agent, cron: [...agent.cron, { id: uid('cr'), ...cronForm, on: true }] })
    setCronForm({ title: '', schedule: '' })
    setCronModal(false)
    toast('Cron vazifa qo‘shildi')
  }
  const runDigest = async () => {
    const today = events.filter((e) => e.date === '2026-09-29')
    const text = `LawCRM kunlik dayjest (29.09): ${today.length} tadbir, ${tasks.filter((x) => x.status !== 'Bajarildi').length} ochiq vazifa.`
    pushNotif({ type: 'deadline', title: 'Kunlik dayjest', text })
    try { await sendTelegram(text); toast('Dayjest Telegram’ga yuborildi') }
    catch { toast('Saytga yuborildi (Telegram sozlanmagan)', 'info') }
    audit('Agent dayjest ishga tushirdi', 'cron')
  }

  const tabs = [['chat', t('ai.chat'), MessageSquare], ['skills', t('ai.skills'), Cpu], ['memory', t('ai.memory'), Brain], ['cron', t('ai.cron'), Clock]]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg"><Bot size={22} /></span>
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.ai.t')}</h1>
        <p className="text-sm text-slate-500">Profil: <b>{agent.profile}</b> • {agent.skills.filter((s) => s.on).length} skill faol</p></div>
      </div>

      <div className="card p-2">
        <div className="flex gap-1 overflow-x-auto p-2">
          {tabs.map(([k, l, Icon]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${tab === k ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Icon size={15} /> {l}</button>
          ))}
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800">
          {tab === 'chat' && (
            <div className="flex flex-col h-[480px]">
              <div className="flex-1 overflow-y-auto scroll-thin p-4 sm:p-5 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${m.from === 'me' ? 'bg-brand-600 text-white rounded-br-md' : 'bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-md shadow-sm'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottom} />
              </div>
              <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={t('ai.chatPh')} className="input !rounded-full !py-3" />
                <button onClick={send} className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 shrink-0"><Send size={17} /></button>
              </div>
            </div>
          )}
          {tab === 'skills' && (
            <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
              {agent.skills.map((s) => (
                <button key={s.id} onClick={() => toggleSkill(s.id)} className={`text-left p-4 rounded-2xl border-2 transition ${s.on ? 'border-brand-300 bg-brand-50/50 dark:bg-brand-950/20' : 'border-slate-100 dark:border-slate-800 opacity-70'}`}>
                  <span className="flex items-center justify-between"><code className="text-[13px] font-bold text-brand-700 dark:text-brand-300">{s.name}</code>
                    <span className={`w-10 h-5 rounded-full p-0.5 transition ${s.on ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition-all ${s.on ? 'ml-5' : ''}`} /></span></span>
                  <span className="block text-xs text-slate-500 mt-1">{s.desc}</span>
                </button>
              ))}
              <p className="sm:col-span-2 text-[11.5px] text-slate-400">MCP ekvivalenti: har bir skill CRM funksiyasiga ulangan (qidiruv, kalendar, Telegram, hujjat generatori). Hermes'da bu nomlar bilan skill yarating — yo‘riqnoma: <code>docs/HERMES_SETUP.md</code>.</p>
            </div>
          )}
          {tab === 'memory' && (
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex gap-2"><input value={memText} onChange={(e) => setMemText(e.target.value)} className="input" placeholder="Xotiraga yozish… (masalan: mijoz afzalligi)" /><button className="btn-primary shrink-0" onClick={addMem}>Yozish</button></div>
              {agent.memory.map((m) => (
                <div key={m.id} className="flex gap-3 p-3.5 rounded-2xl bg-violet-50/60 dark:bg-slate-800/50 border border-violet-100 dark:border-slate-700">
                  <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full h-fit ${m.kind === 'long' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>{m.kind === 'long' ? 'LONG' : 'SESSION'}</span>
                  <span className="flex-1 text-sm dark:text-slate-200">{m.text}</span>
                  <button onClick={() => setAgent({ ...agent, memory: agent.memory.filter((x) => x.id !== m.id) })} className="text-slate-300 hover:text-red-500 text-xs font-bold">✕</button>
                </div>
              ))}
            </div>
          )}
          {tab === 'cron' && (
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex gap-2"><button className="btn-primary" onClick={runDigest}>▶ Dayjestni hozir ishga tushirish</button>
                <button className="btn-ghost" onClick={() => setCronModal(true)}>+ Cron qo‘shish</button></div>
              {agent.cron.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <button onClick={() => toggleCron(c.id)} className={`w-11 h-6 rounded-full p-1 transition shrink-0 ${c.on ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition-all ${c.on ? 'ml-5' : ''}`} /></button>
                  <span className="flex-1"><span className="block text-sm font-bold dark:text-white">{c.title}</span><span className="block text-xs text-slate-400">{c.schedule}</span></span>
                  <button onClick={() => setAgent({ ...agent, cron: agent.cron.filter((x) => x.id !== c.id) })} className="text-slate-300 hover:text-red-500 text-xs font-bold">✕</button>
                </div>
              ))}
              <p className="text-[11.5px] text-slate-400">Telegram holati: {telegramConfigured() ? 'ulangan ✅' : 'sozlanmagan — .env ga token yozing'}</p>
            </div>
          )}
        </div>
      </div>
      <Modal open={cronModal} onClose={() => setCronModal(false)} title="Cron vazifa" width="max-w-sm">
        <Field label="Nomi"><input className="input" value={cronForm.title} onChange={(e) => setCronForm({ ...cronForm, title: e.target.value })} /></Field>
        <div className="mt-3"><Field label="Jadval"><input className="input" value={cronForm.schedule} onChange={(e) => setCronForm({ ...cronForm, schedule: e.target.value })} placeholder="Har kuni 09:00" /></Field></div>
        <div className="flex gap-3 justify-end mt-4"><button className="btn-ghost" onClick={() => setCronModal(false)}>{t('c.cancel')}</button><button className="btn-primary" onClick={addCron}>{t('c.create')}</button></div>
      </Modal>
    </div>
  )
}
