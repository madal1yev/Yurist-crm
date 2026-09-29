import { useRef, useState } from 'react'
import { Download, Upload, DatabaseBackup, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { downloadFile } from '../utils/format'
import { Confirm } from '../components/ui/kit'

export default function Backup() {
  const { toast, audit } = useStore()
  const { t } = useLang()
  const fileRef = useRef(null)
  const [confirm, setConfirm] = useState(false)

  const collect = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('lawcrm_')) data[k] = localStorage.getItem(k)
    }
    return data
  }

  const doExport = () => {
    downloadFile(`lawcrm-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ app: 'LawCRM', at: new Date().toISOString(), data: collect() }, null, 2), 'application/json')
    audit('Zaxira yaratildi', 'backup')
    toast('Zaxira yuklab olindi')
  }

  const doImport = (file) => {
    const rd = new FileReader()
    rd.onload = () => {
      try {
        const j = JSON.parse(rd.result)
        if (!j.data) throw new Error('format')
        Object.entries(j.data).forEach(([k, v]) => localStorage.setItem(k, v))
        audit('Zaxiradan tiklandi', file.name)
        toast('Tiklandi! Sahifa yangilanadi…')
        setTimeout(() => window.location.reload(), 1200)
      } catch { toast('Fayl formati noto‘g‘ri', 'error') }
    }
    rd.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.backup.t')}</h1>
      <p className="text-sm text-slate-500">{t('pg.backup.s')}</p></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-6">
          <span className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center"><Download size={20} /></span>
          <h3 className="font-bold mt-3 dark:text-white">Zaxira yaratish</h3>
          <p className="text-sm text-slate-500 mt-1">Barcha CRM ma’lumotlari (mijozlar, ishlar, to‘lovlar, sozlamalar) JSON faylga ko‘chiriladi.</p>
          <button className="btn-primary mt-4" onClick={doExport}><Download size={16} /> Yuklab olish</button>
        </div>
        <div className="card p-6">
          <span className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center"><Upload size={20} /></span>
          <h3 className="font-bold mt-3 dark:text-white">Tiklash</h3>
          <p className="text-sm text-slate-500 mt-1">Zaxira faylni yuklang — joriy ma’lumotlar almashtiriladi.</p>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={(e) => e.target.files[0] && doImport(e.target.files[0])} />
          <button className="btn-ghost mt-4" onClick={() => fileRef.current.click()}><Upload size={16} /> Fayl tanlash</button>
        </div>
      </div>
      <div className="card p-5 flex gap-3 items-start border-amber-200">
        <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-bold dark:text-white">Eslatma</p>
          <p className="text-slate-500">Hozir ma’lumotlar brauzer localStorage'da. Production'da Postgres + kunlik avtomatik backup (S3) kerak — sxema va RLS allaqachon TZ'da tasvirlangan.</p>
          <button onClick={() => setConfirm(true)} className="mt-2 text-xs font-bold text-red-600 hover:underline">Barcha mahalliy ma’lumotni tozalash…</button>
        </div>
      </div>
      <Confirm open={confirm} onClose={() => setConfirm(false)} title="Tozalashni tasdiqlaysizmi?"
        text="Barcha lawcrm_ kalitlar o‘chadi. Oldin zaxira oling!"
        onConfirm={() => { Object.keys(localStorage).filter((k) => k.startsWith('lawcrm_')).forEach((k) => localStorage.removeItem(k)); window.location.reload() }} />
      <p className="text-xs text-slate-400 flex items-center gap-1.5"><DatabaseBackup size={13} /> Oxirgi zaxira: {localStorage.getItem('lawcrm_lastbackup') || '—'}</p>
    </div>
  )
}
