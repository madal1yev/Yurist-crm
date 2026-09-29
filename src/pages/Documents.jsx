import { useMemo, useRef, useState } from 'react'
import { Search, Upload, Trash2, Download, Pencil, FileText, FolderOpen, Grid3X3, List } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Modal, Confirm, Empty, Field } from '../components/ui/kit'
import { uid } from '../utils/format'

const cats = ['Barchasi', 'Shartnomalar', 'Sud hujjatlari', 'Mijoz hujjatlari', 'Hisobotlar', 'Boshqa']
const fcolor = { pdf: 'bg-red-50 text-red-600', docx: 'bg-blue-50 text-blue-600', xlsx: 'bg-emerald-50 text-emerald-600', default: 'bg-slate-100 text-slate-500' }

export default function Documents() {
  const { docs, setDocs, clients, toast, audit } = useStore()
  const { t } = useLang()
  const [preview, setPreview] = useState(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Barchasi')
  const [view, setView] = useState('grid')
  const [del, setDel] = useState(null)
  const [ren, setRen] = useState(null)
  const [newName, setNewName] = useState('')
  const fileRef = useRef(null)

  const filtered = useMemo(() => docs.filter((d) =>
    d.name.toLowerCase().includes(q.toLowerCase()) && (cat === 'Barchasi' || d.category === cat)), [docs, q, cat])

  const cname = (id) => clients.find((c) => c.id === id)?.name || '—'

  const onFiles = (files) => {
    const arr = [...files].slice(0, 5).map((f) => {
      const ext = (f.name.split('.').pop() || 'file').toLowerCase()
      return { id: uid('doc'), name: f.name, category: 'Boshqa', size: f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1024)) + ' KB', type: ['pdf', 'docx', 'xlsx'].includes(ext) ? ext : 'file', clientId: null, caseId: null, updated: new Date().toISOString().slice(0, 10), url: URL.createObjectURL(f), mime: f.type }
    })
    if (arr.length) { setDocs((p) => [...arr, ...p]); audit('Fayl yuklandi', arr.map((a) => a.name).join(', ')); toast(`${arr.length} ta fayl yuklandi`) }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.documents.t')}</h1><p className="text-sm text-slate-500">{filtered.length} ta fayl • {t('pg.documents.s')}</p></div>
        <div className="flex-1" />
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-white dark:bg-slate-900 shadow text-brand-600' : 'text-slate-400'}`}><Grid3X3 size={16} /></button>
          <button onClick={() => setView('table')} className={`p-2 rounded-lg ${view === 'table' ? 'bg-white dark:bg-slate-900 shadow text-brand-600' : 'text-slate-400'}`}><List size={16} /></button>
        </div>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        <button className="btn-primary" onClick={() => fileRef.current.click()}><Upload size={16} /> {t('c.upload')}</button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input !pl-10" placeholder="Fayl nomi bo‘yicha qidirish…" /></div>
          <div className="flex gap-2 overflow-x-auto">{cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3.5 py-2.5 rounded-xl text-[12.5px] font-bold whitespace-nowrap transition ${cat === c ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{c}</button>
          ))}</div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 mt-4">
            {filtered.map((d) => (
              <div key={d.id} className="card card-hover !shadow-card p-4 group">
                <div className="flex items-start gap-3">
                  <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-[11px] shrink-0 ${fcolor[d.type] || fcolor.default}`}>{(d.type || 'FILE').toUpperCase().slice(0, 4)}</span>
                  <div className="flex-1 min-w-0"><p className="text-[13.5px] font-bold truncate dark:text-white" title={d.name}>{d.name}</p>
                    <p className="text-[11.5px] text-slate-400 mt-0.5">{d.category} • {d.size}</p></div>
                </div>
                <p className="text-[11.5px] text-slate-400 mt-2.5">{d.clientId ? '👤 ' + cname(d.clientId) : 'Umumiy'} • {d.updated}</p>
                <div className="flex gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <button onClick={() => setPreview(d)} className="flex-1 btn-ghost !py-2 !text-xs">{t('c.view')}</button>
                  <button onClick={() => {
                    if (d.url) { const a = document.createElement('a'); a.href = d.url; a.download = d.name; a.click() }
                    else toast('Demo fayl — asl nusxa serverda saqlanadi', 'info')
                  }} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-600"><Download size={15} /></button>
                  <button onClick={() => { setRen(d); setNewName(d.name) }} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600"><Pencil size={15} /></button>
                  <button onClick={() => setDel(d)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[760px]">
              <thead><tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40"><th className="th">Fayl</th><th className="th">Kategoriya</th><th className="th">Mijoz</th><th className="th">O‘lcham</th><th className="th text-right">Amal</th></tr></thead>
              <tbody>{filtered.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-brand-50/40 transition">
                  <td className="td"><span className="flex items-center gap-2.5 font-bold dark:text-white"><FileText size={16} className="text-slate-300" />{d.name}</span></td>
                  <td className="td text-slate-500">{d.category}</td><td className="td text-slate-500">{cname(d.clientId)}</td><td className="td text-slate-500">{d.size}</td>
                  <td className="td"><div className="flex justify-end gap-1">
                    <button onClick={() => { setRen(d); setNewName(d.name) }} className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={15} /></button>
                    <button onClick={() => setDel(d)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                  </div></td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
        {filtered.length === 0 && <Empty icon={<FolderOpen size={24} />} title="Hujjat topilmadi" text="Yangi fayl yuklang yoki qidiruvni o‘zgartiring." action={<button className="btn-primary" onClick={() => fileRef.current.click()}><Upload size={16} /> Fayl yuklash</button>} />}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name || 'Ko‘rish'} subtitle={`${preview?.category || ''} • ${preview?.size || ''}`} width="max-w-2xl">
        {preview?.url ? (
          (preview.mime || '').startsWith('image/') ? (
            <img src={preview.url} alt={preview.name} className="max-h-[60vh] mx-auto rounded-2xl" />
          ) : (preview.mime || '').includes('pdf') || preview.type === 'pdf' ? (
            <iframe src={preview.url} title={preview.name} className="w-full h-[60vh] rounded-2xl border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="text-center py-8"><p className="text-sm text-slate-500">Bu format brauzerda ko‘rsatilmaydi.</p>
              <a href={preview.url} download={preview.name} className="btn-primary mt-3 inline-flex"><Download size={15} /> Yuklab olish</a></div>
          )
        ) : (
          <div className="text-sm space-y-2">
            <p><span className="text-slate-400">Mijoz: </span><b>{cname(preview?.clientId)}</b></p>
            <p><span className="text-slate-400">Yangilangan: </span><b>{preview?.updated}</b></p>
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 p-3.5 text-amber-700 dark:text-amber-300">Demo yozuv — fayl tanasi server omborida (S3) saqlanadi. Yangi yuklangan fayllar shu yerda ko‘rinadi.</div>
          </div>
        )}
      </Modal>
      <Modal open={!!ren} onClose={() => setRen(null)} title="Faylni qayta nomlash" width="max-w-sm">
        <Field label="Fayl nomi"><input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} /></Field>
        <div className="flex gap-3 justify-end mt-4"><button className="btn-ghost" onClick={() => setRen(null)}>Bekor</button>
          <button className="btn-primary" onClick={() => { setDocs((p) => p.map((d) => d.id === ren.id ? { ...d, name: newName } : d)); setRen(null); toast('Nom yangilandi') }}>Saqlash</button></div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title="Faylni o‘chirish" text={del?.name} onConfirm={() => { setDocs((p) => p.filter((d) => d.id !== del.id)); toast('Fayl o‘chirildi', 'info') }} />
    </div>
  )
}
