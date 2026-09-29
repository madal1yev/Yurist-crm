import { useState } from 'react'
import { Plus, Pencil, Trash2, ShieldCheck, Mail, Phone } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Field } from '../components/ui/kit'
import { initials, avatarColor, uid } from '../utils/format'

const roles = ['Admin', 'Senior Lawyer', 'Lawyer', 'Assistant', 'Accountant']
const statusColor = { 'Online': 'bg-emerald-500', 'Band': 'bg-amber-500', 'Offline': 'bg-slate-300' }

export default function Team() {
  const { team, setTeam, toast, audit } = useStore()
  const { t } = useLang()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [perm, setPerm] = useState(null)
  const [form, setForm] = useState({ name: '', position: '', email: '', phone: '', role: 'Lawyer', status: 'Online' })
  const [perms, setPerms] = useState({ Mijozlar: true, Ishlar: true, 'To‘lovlar': false, Hisobotlar: false, Sozlamalar: false })

  const openAdd = () => { setEditing(null); setForm({ name: '', position: '', email: '', phone: '', role: 'Lawyer', status: 'Online' }); setModal(true) }
  const openEdit = (t) => { setEditing(t); setForm({ ...t }); setModal(true) }

  const save = () => {
    if (form.name.trim().length < 3 || !/^\S+@\S+\.\S+$/.test(form.email)) { toast('Ism va emailni tekshiring', 'error'); return }
    if (editing) { setTeam((p) => p.map((t) => t.id === editing.id ? { ...t, ...form } : t)); audit('Xodim yangilandi', form.name); toast('Xodim yangilandi') }
    else { setTeam((p) => [{ id: uid('tm'), cases: 0, winRate: 0, ...form }, ...p]); audit('Xodim qo‘shildi', form.name); toast('Yangi xodim qo‘shildi') }
    setModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.team.t')}</h1><p className="text-sm text-slate-500">{team.length} ta xodim • {team.filter((x) => x.status === 'Online').length} online</p></div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={openAdd}><Plus size={17} /> {t('btn.newEmployee')}</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map((t) => (
          <div key={t.id} className="card card-hover p-5">
            <div className="flex items-start gap-3.5">
              <span className="relative"><span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-extrabold ${avatarColor(t.name)}`}>{initials(t.name)}</span>
                <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ring-2 ring-white ${statusColor[t.status]}`} /></span>
              <div className="flex-1 min-w-0"><h3 className="font-bold text-[15px] dark:text-white truncate">{t.name}</h3><p className="text-xs text-slate-400">{t.position}</p>
                <span className="inline-block mt-1.5 text-[10.5px] font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">{t.role}</span></div>
              <div className="flex gap-0.5">
                <button onClick={() => openEdit(t)} className="p-2 text-slate-300 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil size={15} /></button>
                <button onClick={() => setDel(t)} className="p-2 text-slate-300 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={15} /></button>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[12.5px] text-slate-500">
              <p className="flex items-center gap-2 truncate"><Mail size={13} /> {t.email}</p>
              <p className="flex items-center gap-2"><Phone size={13} /> {t.phone}</p>
            </div>
            {t.cases > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">{t.cases} ta ish</span>
                <span className="text-emerald-600">Win rate {t.winRate}%</span>
              </div>
            )}
            <button onClick={() => setPerm(t)} className="mt-3 w-full btn-ghost !py-2 !text-xs"><ShieldCheck size={14} /> Ruxsatlarni boshqarish</button>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Xodimni tahrirlash' : 'Yangi xodim'}>
        <div className="space-y-4">
          <Field label="F.I.Sh *"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Jasur Toshpo‘latov" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Lavozim"><input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Yurist" /></Field>
            <Field label="Rol"><select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((r) => <option key={r}>{r}</option>)}</select></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *"><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Telefon"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 ..." /></Field>
          </div>
          <div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={() => setModal(false)}>Bekor</button><button className="btn-primary" onClick={save}>Saqlash</button></div>
        </div>
      </Modal>

      <Modal open={!!perm} onClose={() => setPerm(null)} title={`Ruxsatlar — ${perm?.name}`} subtitle={perm?.role} width="max-w-sm">
        <div className="space-y-2.5">
          {Object.entries(perms).map(([k, v]) => (
            <button key={k} onClick={() => setPerms({ ...perms, [k]: !v })} className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-300 transition">
              <span className="text-sm font-bold dark:text-white">{k}</span>
              <span className={`w-11 h-6 rounded-full p-1 transition ${v ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition-all ${v ? 'ml-5' : ''}`} /></span>
            </button>
          ))}
          <button className="btn-primary w-full" onClick={() => { setPerm(null); toast('Ruxsatlar saqlandi') }}>Saqlash</button>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title="Xodimni o‘chirish" text={del?.name} onConfirm={() => { setTeam((p) => p.filter((t) => t.id !== del.id)); toast('Xodim o‘chirildi', 'info') }} />
    </div>
  )
}
