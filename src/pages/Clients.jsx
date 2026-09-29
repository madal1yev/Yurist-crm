import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, ChevronLeft, ChevronRight, ArrowUpDown, Pencil, Trash2, Eye, Users as UsersIcon, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Badge, Empty, Field } from '../components/ui/kit'
import { initials, avatarColor, fmtDate, uid, exportCSV } from '../utils/format'

const PAGE = 6

export default function Clients() {
  const { clients, setClients, toast, pushNotif, audit } = useStore()
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('Barchasi')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'name', dir: 1 })
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', status: 'Faol' })
  const [errs, setErrs] = useState({})

  const filtered = useMemo(() => {
    let r = clients.filter((c) =>
      (c.name + ' ' + c.phone + ' ' + (c.email || '')).toLowerCase().includes(q.toLowerCase()) &&
      (status === 'Barchasi' || c.status === status))
    r = [...r].sort((a, b) => {
      const k = sort.key
      const va = (a[k] || '').toString().toLowerCase(), vb = (b[k] || '').toString().toLowerCase()
      return va > vb ? sort.dir : va < vb ? -sort.dir : 0
    })
    return r
  }, [clients, q, status, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE)

  const openAdd = () => { setEditing(null); setForm({ name: '', phone: '', email: '', address: '', status: 'Faol' }); setErrs({}); setModal(true) }
  const openEdit = (c) => { setEditing(c); setForm({ ...c }); setErrs({}); setModal(true) }

  const save = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Ism kamida 3 ta belgidan iborat bo‘lsin'
    if (!/^\+998[\s\d]{9,}$/.test(form.phone.trim())) e.phone = 'Telefon formati: +998 90 123 45 67'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Email noto‘g‘ri'
    setErrs(e)
    if (Object.keys(e).length) return
    if (editing) {
      setClients((p) => p.map((c) => c.id === editing.id ? { ...c, ...form } : c))
      audit('Mijoz yangilandi', form.name)
      toast('Mijoz yangilandi')
    } else {
      const nc = { id: uid('cl'), createdAt: new Date().toISOString().slice(0, 10), tags: ['Yangi'], birth: '', notes: '', ...form }
      setClients((p) => [nc, ...p])
      audit('Mijoz yaratildi', form.name)
      toast('Yangi mijoz qo‘shildi')
      pushNotif({ type: 'client', title: 'Yangi mijoz qo‘shildi', text: `${form.name} tizimga qo‘shildi` })
    }
    setModal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.clients.t')}</h1>
          <p className="text-sm text-slate-500">{t('c.total')}: {filtered.length} • {clients.filter((c) => c.status === 'Faol').length} faol</p>
        </div>
        <div className="flex-1" />
        <button className="btn-ghost !py-2.5 text-[13px]" onClick={() => {
          const ok = exportCSV('mijozlar.csv', filtered.map((c) => ({ ism: c.name, telefon: c.phone, email: c.email, status: c.status, sana: c.createdAt })))
          toast(ok ? 'CSV yuklab olindi' : 'Ma’lumot yo‘q', ok ? 'success' : 'error')
          if (ok) audit('Mijozlar eksport qilindi', `${filtered.length} ta`)
        }}><Download size={16} /> {t('c.export')}</button>
        <button className="btn-primary" onClick={openAdd}><Plus size={17} /> {t('btn.newClient')}</button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Ism, telefon yoki email bo‘yicha qidirish…"
              className="input !pl-10" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['Barchasi', 'Faol', 'Kutmoqda', 'Yakunlangan', 'Muammo'].map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1) }}
                className={`px-3.5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${status === s ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                {[
                  ['name', t('th.client')], ['phone', t('th.phone')], ['email', t('th.email')], ['status', t('th.status')], ['createdAt', t('th.date')]
                ].map(([k, l]) => (
                  <th key={k} className="th cursor-pointer select-none hover:text-brand-600" onClick={() => setSort({ key: k, dir: sort.key === k ? -sort.dir : 1 })}>
                    <span className="inline-flex items-center gap-1">{l} <ArrowUpDown size={12} /></span>
                  </th>
                ))}
                <th className="th text-right">{t('c.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-brand-50/40 dark:hover:bg-slate-800/40 transition cursor-pointer">
                  <td className="td">
                    <Link to={`/clients/${c.id}`} className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(c.name)}`}>{initials(c.name)}</span>
                      <span><span className="block font-bold text-slate-800 dark:text-white hover:text-brand-600">{c.name}</span>
                      <span className="block text-[11.5px] text-slate-400">{(c.tags || []).join(' • ')}</span></span>
                    </Link>
                  </td>
                  <td className="td font-medium text-slate-600 dark:text-slate-300">{c.phone}</td>
                  <td className="td text-slate-500">{c.email}</td>
                  <td className="td"><Badge value={c.status} /></td>
                  <td className="td text-slate-500">{fmtDate(c.createdAt)}</td>
                  <td className="td">
                    <div className="flex justify-end gap-1">
                      <Link to={`/clients/${c.id}`} className="p-2 rounded-lg hover:bg-brand-100 hover:text-brand-700 text-slate-400 transition" title="Ko‘rish"><Eye size={16} /></Link>
                      <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-blue-100 hover:text-blue-700 text-slate-400 transition" title="Tahrirlash"><Pencil size={16} /></button>
                      <button onClick={() => setDel(c)} className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 text-slate-400 transition" title="O‘chirish"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <Empty icon={<UsersIcon size={24} />} title="Mijoz topilmadi" text="Qidiruv yoki filtrni o‘zgartirib ko‘ring." action={<button className="btn-primary" onClick={openAdd}><Plus size={16} /> Yangi mijoz qo‘shish</button>} />}
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-400 font-medium">{(page - 1) * PAGE + 1}–{Math.min(page * PAGE, filtered.length)} / {filtered.length} ko‘rsatilmoqda</p>
          <div className="flex items-center gap-1.5">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft size={16} /></button>
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-[13px] font-bold transition ${page === i + 1 ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}>{i + 1}</button>
            ))}
            <button disabled={page === pages} onClick={() => setPage(page + 1)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Mijozni tahrirlash' : 'Yangi mijoz qo‘shish'} subtitle="Barcha maydonlarni to‘g‘ri to‘ldiring">
        <div className="space-y-4">
          <Field label="F.I.Sh *" error={errs.name}><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Abdulla Karimov" /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefon *" error={errs.phone}><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67" /></Field>
            <Field label="Email *" error={errs.email}><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@mail.uz" /></Field>
          </div>
          <Field label="Manzil"><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Shahar, tuman, ko‘cha" /></Field>
          <Field label="Status">
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Faol</option><option>Kutmoqda</option><option>Yakunlangan</option><option>Muammo</option>
            </select>
          </Field>
          <div className="flex gap-3 justify-end pt-2">
            <button className="btn-ghost" onClick={() => setModal(false)}>Bekor qilish</button>
            <button className="btn-primary" onClick={save}>{editing ? 'Saqlash' : 'Qo‘shish'}</button>
          </div>
        </div>
      </Modal>

      <Confirm open={!!del} onClose={() => setDel(null)} title="Mijozni o‘chirish" text={`${del?.name} tizimdan o‘chiriladi. Davom etasizmi?`}
        onConfirm={() => { setClients((p) => p.filter((c) => c.id !== del.id)); audit('Mijoz o‘chirildi', del.name); toast('Mijoz o‘chirildi', 'info') }} />
    </div>
  )
}
