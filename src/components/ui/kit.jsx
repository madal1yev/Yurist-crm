import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { useStore } from '../../store/StoreContext'

export function Modal({ open, onClose, title, subtitle, children, width = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`relative w-full ${width} bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-pop border border-slate-200/70 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden`}
          >
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 overflow-y-auto scroll-thin">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Confirm({ open, onClose, onConfirm, title = 'O‘chirishni tasdiqlaysizmi?', text = 'Bu amalni ortga qaytarib bo‘lmaydi.' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={text} width="max-w-sm">
      <div className="flex gap-3 justify-end pt-2">
        <button className="btn-ghost" onClick={onClose}>Bekor qilish</button>
        <button className="btn-danger" onClick={() => { onConfirm(); onClose() }}>Ha, o‘chirish</button>
      </div>
    </Modal>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  const icons = { success: <CheckCircle2 size={18} className="text-emerald-500" />, error: <AlertTriangle size={18} className="text-red-500" />, info: <Info size={18} className="text-blue-500" /> }
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
            className="flex items-center gap-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 pl-3 pr-4 py-3 rounded-2xl shadow-pop text-sm font-medium">
            {icons[t.type] || icons.success}
            {t.title}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function Empty({ icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-slate-800 flex items-center justify-center text-brand-600 mb-4">{icon}</div>
      <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Field({ label, children, error }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  )
}

export const badgeStyles = {
  'Faol': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Kutmoqda': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Kutilmoqda': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Yakunlangan': 'bg-slate-100 text-slate-600 ring-slate-200',
  'Muammo': 'bg-red-50 text-red-700 ring-red-200',
  'Yangi': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Jarayonda': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Sudda': 'bg-violet-50 text-violet-700 ring-violet-200',
  'Kutilyapti': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Yopilgan': 'bg-slate-100 text-slate-600 ring-slate-200',
  'To‘langan': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Kechikkan': 'bg-red-50 text-red-700 ring-red-200',
  'Low': 'bg-slate-100 text-slate-600 ring-slate-200',
  'Medium': 'bg-blue-50 text-blue-700 ring-blue-200',
  'High': 'bg-orange-50 text-orange-700 ring-orange-200',
  'Urgent': 'bg-red-50 text-red-700 ring-red-200'
}

export function Badge({ value }) {
  const cls = badgeStyles[value] || 'bg-slate-100 text-slate-600 ring-slate-200'
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold ring-1 ring-inset ${cls}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{value}</span>
}

export function StatSkeleton() {
  return <div className="card p-5"><div className="skeleton h-4 w-24 mb-3" /><div className="skeleton h-8 w-32 mb-2" /><div className="skeleton h-3 w-40" /></div>
}
