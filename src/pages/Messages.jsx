import { useState, useRef, useEffect } from 'react'
import { Search, Send, Paperclip, Phone, Video, MoreVertical, CheckCheck } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { initials, avatarColor } from '../utils/format'

export default function Messages() {
  const { convs, setConvs, toast, audit } = useStore()
  const { t } = useLang()
  const [call, setCall] = useState(null)
  const [secs, setSecs] = useState(0)
  const fileRef = useRef(null)
  const [active, setActive] = useState(convs[0]?.id)
  const [q, setQ] = useState('')
  const [text, setText] = useState('')
  const [mobileChat, setMobileChat] = useState(false)
  const bottomRef = useRef(null)

  const conv = convs.find((c) => c.id === active)
  const list = convs.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [conv?.messages?.length, active])

  useEffect(() => {
    if (!call) { setSecs(0); return }
    const id = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [call])

  const attach = (files) => {
    const f = files[0]
    if (!f || !conv) return
    const label = `📎 ${f.name}`
    setConvs((p) => p.map((c) => c.id === active
      ? { ...c, last: label, time: 'Hozir', messages: [...c.messages, { from: 'me', text: label, time: 'Hozir' }] } : c))
    audit('Fayl yuborildi', `${conv.name} — ${f.name}`)
    toast('Fayl yuborildi')
  }

  const send = () => {
    if (!text.trim() || !conv) return
    setConvs((p) => p.map((c) => c.id === active
      ? { ...c, unread: 0, last: text, time: 'Hozir', messages: [...c.messages, { from: 'me', text, time: 'Hozir' }] }
      : c))
    setText('')
    setTimeout(() => {
      setConvs((p) => p.map((c) => c.id === active
        ? { ...c, messages: [...c.messages, { from: 'them', text: 'Rahmat! Tez orada javob beraman. 👍', time: 'Hozir' }], last: 'Rahmat! Tez orada javob beraman. 👍' }
        : c))
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.messages.t')}</h1><p className="text-sm text-slate-500">{t('pg.messages.s')}</p></div>
      <div className="card overflow-hidden !p-0 grid md:grid-cols-[300px_1fr] min-h-[560px] max-h-[72vh]">
        {/* conversations */}
        <div className={`border-r border-slate-100 dark:border-slate-800 flex-col min-h-0 ${mobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Suhbat qidirish…" className="input !pl-9 !py-2.5" /></div>
          </div>
          <div className="flex-1 overflow-y-auto scroll-thin">
            {list.map((c) => (
              <button key={c.id} onClick={() => { setActive(c.id); setMobileChat(true); setConvs((p) => p.map((x) => x.id === c.id ? { ...x, unread: 0 } : x)) }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition border-l-[3px] ${active === c.id ? 'bg-brand-50/70 dark:bg-slate-800/70 border-brand-600' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                <span className="relative shrink-0"><span className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(c.name)}`}>{initials(c.name)}</span>
                  {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />}</span>
                <span className="flex-1 min-w-0"><span className="flex items-center justify-between gap-2"><span className="text-[13.5px] font-bold truncate dark:text-white">{c.name}</span><span className="text-[10.5px] text-slate-400 shrink-0">{c.time}</span></span>
                  <span className="flex items-center justify-between gap-2 mt-0.5"><span className="text-xs text-slate-400 truncate">{c.last}</span>
                    {c.unread > 0 && <span className="min-w-[19px] h-[19px] px-1 rounded-full bg-brand-600 text-white text-[10.5px] font-bold flex items-center justify-center shrink-0">{c.unread}</span>}</span></span>
              </button>
            ))}
          </div>
        </div>
        {/* chat */}
        <div className={`flex-col min-h-0 min-w-0 ${mobileChat ? 'flex' : 'hidden md:flex'}`}>
          {!conv ? <p className="m-auto text-sm text-slate-400">Suhbat tanlang</p> : (
            <>
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                <button className="md:hidden text-slate-400 font-bold" onClick={() => setMobileChat(false)}>←</button>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(conv.name)}`}>{initials(conv.name)}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate dark:text-white">{conv.name}</p><p className={`text-[11.5px] font-semibold ${conv.online ? 'text-emerald-600' : 'text-slate-400'}`}>{conv.online ? '● Online' : '○ Offline'}</p></div>
                <button onClick={() => setCall({ kind: 'audio', name: conv.name })} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><Phone size={17} /></button>
                <button onClick={() => setCall({ kind: 'video', name: conv.name })} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><Video size={17} /></button>
                <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><MoreVertical size={17} /></button>
              </div>
              <div className="flex-1 overflow-y-auto scroll-thin p-4 sm:p-5 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
                {conv.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${m.from === 'me' ? 'bg-brand-600 text-white rounded-br-md shadow-md shadow-brand-600/20' : 'bg-white dark:bg-slate-800 dark:text-slate-100 rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700'}`}>
                      {m.text}
                      <span className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${m.from === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>{m.time} {m.from === 'me' && <CheckCheck size={12} />}</span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input ref={fileRef} type="file" className="hidden" onChange={(e) => attach(e.target.files)} />
                <button onClick={() => fileRef.current.click()} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 shrink-0"><Paperclip size={18} /></button>
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Xabar yozing…" className="input !rounded-full !py-3" />
                <button onClick={send} disabled={!text.trim()} className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 active:scale-95 transition disabled:opacity-40 shrink-0 shadow-lg shadow-brand-600/30"><Send size={17} /></button>
              </div>
            </>
          )}
        </div>
      </div>
      {call && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
          <div className="relative card p-8 text-center w-full max-w-xs">
            <span className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center mx-auto animate-pulse">
              {call.kind === 'video' ? <Video size={26} /> : <Phone size={26} />}
            </span>
            <p className="font-bold mt-3 dark:text-white">{call.name}</p>
            <p className="text-sm text-slate-400">{String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')} • simulyatsiya</p>
            <button onClick={() => { setCall(null); toast('Qo‘ng‘iroq yakunlandi', 'info') }} className="btn-danger w-full mt-5">Yakunlash</button>
          </div>
        </div>
      )}
    </div>
  )
}
