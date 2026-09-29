import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Users, Scale, FileText, CreditCard, MessagesSquare, CornerDownLeft } from 'lucide-react'
import { useStore } from '../../store/StoreContext'

export default function CommandPalette() {
  const { cmdkOpen, setCmdkOpen, clients, cases, docs, payments, convs, tasks, leads } = useStore()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => { if (!cmdkOpen) setQ('') }, [cmdkOpen])

  const results = useMemo(() => {
    if (!q.trim()) return []
    const s = q.toLowerCase()
    const out = []
    clients.filter((c) => (c.name + c.phone + (c.email || '')).toLowerCase().includes(s)).slice(0, 4)
      .forEach((c) => out.push({ icon: Users, label: c.name, sub: `Mijoz • ${c.phone}`, go: `/clients/${c.id}` }))
    cases.filter((c) => (c.title + c.id).toLowerCase().includes(s)).slice(0, 4)
      .forEach((c) => out.push({ icon: Scale, label: c.title, sub: `Ish • ${c.id}`, go: `/cases/${c.id}` }))
    docs.filter((d) => d.name.toLowerCase().includes(s)).slice(0, 3)
      .forEach((d) => out.push({ icon: FileText, label: d.name, sub: 'Hujjat', go: '/documents' }))
    payments.filter((p) => (p.id + '').toLowerCase().includes(s)).slice(0, 3)
      .forEach((p) => out.push({ icon: CreditCard, label: p.id, sub: 'To‘lov', go: '/payments' }))
    convs.filter((c) => c.name.toLowerCase().includes(s)).slice(0, 2)
      .forEach((c) => out.push({ icon: MessagesSquare, label: c.name, sub: 'Xabar', go: '/messages' }))
    ;(tasks || []).filter((x) => (x.title || '').toLowerCase().includes(s)).slice(0, 2)
      .forEach((x) => out.push({ icon: FileText, label: x.title, sub: 'Vazifa', go: '/tasks' }))
    ;(leads || []).filter((x) => (x.name + x.phone).toLowerCase().includes(s)).slice(0, 2)
      .forEach((x) => out.push({ icon: Users, label: x.name, sub: 'Murojaat', go: '/leads' }))
    return out.slice(0, 10)
  }, [q, clients, cases, docs, payments, convs, tasks, leads])

  return (
    <AnimatePresence>
      {cmdkOpen && (
        <motion.div className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setCmdkOpen(false)} />
          <motion.div initial={{ opacity: 0, y: -12, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.99 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-pop border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <Search size={18} className="text-slate-400" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mijoz, ish, hujjat, to‘lov qidirish…"
                className="flex-1 bg-transparent outline-none text-[15px] dark:text-white placeholder:text-slate-400" />
              <kbd className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-slate-500">ESC</kbd>
            </div>
            <div className="max-h-[340px] overflow-y-auto scroll-thin p-2">
              {q.trim() === '' && <p className="text-sm text-slate-400 text-center py-8">Qidiruv uchun yozishni boshlang…</p>}
              {q.trim() !== '' && results.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Hech narsa topilmadi</p>}
              {results.map((r, i) => (
                <button key={i} onClick={() => { navigate(r.go); setCmdkOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800 text-left group">
                  <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-700"><r.icon size={16} /></span>
                  <span className="flex-1 min-w-0"><span className="block text-sm font-bold truncate dark:text-white">{r.label}</span><span className="block text-xs text-slate-400">{r.sub}</span></span>
                  <CornerDownLeft size={14} className="text-slate-300" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
