import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'

const modules = ['Mijozlar', 'Ishlar', 'Vazifalar', 'To‘lovlar', 'Hujjatlar', 'Hisobotlar', 'Sozlamalar', 'Audit']
const roles = ['Admin', 'Senior Lawyer', 'Lawyer', 'Assistant', 'Accountant']
const defaults = {
  'Admin': [1, 1, 1, 1, 1, 1, 1, 1],
  'Senior Lawyer': [1, 1, 1, 0, 1, 1, 0, 0],
  'Lawyer': [1, 1, 1, 0, 1, 0, 0, 0],
  'Assistant': [1, 0, 1, 0, 1, 0, 0, 0],
  'Accountant': [0, 0, 0, 1, 0, 1, 0, 0]
}

export default function Roles() {
  const { toast, audit } = useStore()
  const { t } = useLang()
  const [matrix, setMatrix] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lawcrm_roles') || JSON.stringify(defaults)) } catch { return defaults }
  })

  const toggle = (r, i) => {
    const nm = { ...matrix, [r]: matrix[r].map((v, j) => j === i ? (v ? 0 : 1) : v) }
    setMatrix(nm)
    localStorage.setItem('lawcrm_roles', JSON.stringify(nm))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.roles.t')}</h1>
        <p className="text-sm text-slate-500">{t('pg.roles.s')}</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => { audit('Ruxsatlar yangilandi', 'roles'); toast('Ruxsatlar saqlandi') }}><ShieldCheck size={16} /> {t('c.save')}</button>
      </div>
      <div className="card p-4 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead><tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="th">Rol \ Modul</th>{modules.map((m) => <th key={m} className="th text-center">{m}</th>)}
          </tr></thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r} className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="td font-bold dark:text-white">{r}</td>
                {modules.map((_, i) => (
                  <td key={i} className="td text-center">
                    <button onClick={() => toggle(r, i)} className={`w-7 h-7 rounded-lg font-bold text-sm transition ${matrix[r][i] ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}`}>
                      {matrix[r][i] ? '✓' : '–'}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[11.5px] text-slate-400 mt-3">Matritsa localStorage'da saqlanadi. Backend ulanganda RLS/policy bilan serverda ham tekshiriladi.</p>
      </div>
    </div>
  )
}
