import { useState, useRef } from 'react'
import { User, Building2, Bell, ShieldCheck, CreditCard, Palette, Sun, Moon, Monitor, Check } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useLang } from '../i18n'
import { Field, Modal } from '../components/ui/kit'

const sections = [['profile', 'Profil', User], ['company', 'Kompaniya', Building2], ['notif', 'Bildirishnomalar', Bell], ['security', 'Xavfsizlik', ShieldCheck], ['billing', 'Billing', CreditCard], ['appearance', 'Ko‘rinish', Palette]]

export default function Settings() {
  const { theme, setTheme, toast, avatar, setAvatar, audit, profile, company, notifPrefs, updateProfile, updateCompany, updateNotifPrefs } = useStore()
  const { t } = useLang()
  const [plan, setPlan] = useState(() => localStorage.getItem('lawcrm_plan') || 'Professional')
  const [planModal, setPlanModal] = useState(false)
  const photoRef = useRef(null)
  const [sec, setSec] = useState('profile')
  const [pDraft, setPDraft] = useState(profile)
  const [cDraft, setCDraft] = useState(company)
  const [nDraft, setNDraft] = useState(notifPrefs)

  const save = () => {
    if (sec === 'profile') updateProfile(pDraft)
    else if (sec === 'company') updateCompany(cDraft)
    else if (sec === 'notif') updateNotifPrefs(nDraft)
    audit('Sozlamalar saqlandi', sec)
    toast('Sozlamalar saqlandi')
  }

  return (
    <div className="space-y-4">
      <div><h1 className="font-display text-[22px] font-extrabold tracking-tight dark:text-white">{t('pg.settings.t')}</h1><p className="text-sm text-slate-500">{t('pg.settings.s')}</p></div>
      <div className="grid lg:grid-cols-[240px_1fr] gap-4 items-start">
        <div className="card p-2.5 flex lg:flex-col gap-1 overflow-x-auto">
          {sections.map(([k, l, Icon]) => (
            <button key={k} onClick={() => setSec(k)} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-bold whitespace-nowrap transition ${sec === k ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Icon size={16} /> {l}</button>
          ))}
        </div>
        <div className="card p-6">
          {sec === 'profile' && (
            <div className="space-y-4 max-w-lg"><h3 className="font-display font-bold dark:text-white">Shaxsiy profil</h3>
              <div className="flex items-center gap-4">
                {avatar
                  ? <img src={avatar} alt="profil" className="w-16 h-16 rounded-3xl object-cover ring-2 ring-brand-100" />
                  : <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white flex items-center justify-center font-extrabold text-lg">{(pDraft.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</div>}
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files[0]
                  if (!f) return
                  const rd = new FileReader()
                  rd.onload = () => { setAvatar(rd.result); audit('Profil rasmi yangilandi', ''); toast('Rasm yangilandi') }
                  rd.readAsDataURL(f)
                }} />
                <button className="btn-ghost !py-2 !text-[13px]" onClick={() => photoRef.current.click()}>Rasmni almashtirish</button></div>
              <Field label="F.I.Sh"><input className="input" value={pDraft.name} onChange={(e) => setPDraft({ ...pDraft, name: e.target.value })} /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email"><input className="input" value={pDraft.email} onChange={(e) => setPDraft({ ...pDraft, email: e.target.value })} /></Field>
                <Field label="Telefon"><input className="input" value={pDraft.phone} onChange={(e) => setPDraft({ ...pDraft, phone: e.target.value })} /></Field>
              </div>
              <button className="btn-primary" onClick={save}>Saqlash</button></div>
          )}
          {sec === 'company' && (
            <div className="space-y-4 max-w-lg"><h3 className="font-display font-bold dark:text-white">Kompaniya</h3>
              <Field label="Kompaniya nomi"><input className="input" value={cDraft.name} onChange={(e) => setCDraft({ ...cDraft, name: e.target.value })} /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="STIR"><input className="input" value={cDraft.stir} onChange={(e) => setCDraft({ ...cDraft, stir: e.target.value })} /></Field>
                <Field label="Manzil"><input className="input" value={cDraft.address} onChange={(e) => setCDraft({ ...cDraft, address: e.target.value })} /></Field>
              </div>
              <button className="btn-primary" onClick={save}>Saqlash</button></div>
          )}
          {sec === 'notif' && (
            <div className="space-y-2.5 max-w-lg"><h3 className="font-display font-bold dark:text-white">Bildirishnomalar</h3>
              {[['email', 'Email bildirishnomalar'], ['sms', 'SMS xabarnomalar'], ['push', 'Push bildirishnomalar'], ['deadline', 'Deadline eslatmalari']].map(([k, l]) => (
                <button key={k} onClick={() => setNDraft({ ...nDraft, [k]: !nDraft[k] })} className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold dark:text-white">{l}</span>
                  <span className={`w-11 h-6 rounded-full p-1 transition ${nDraft[k] ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}><span className={`block w-4 h-4 rounded-full bg-white transition-all ${nDraft[k] ? 'ml-5' : ''}`} /></span>
                </button>))}
              <button className="btn-primary" onClick={save}>Saqlash</button></div>
          )}
          {sec === 'security' && (
            <div className="space-y-4 max-w-lg"><h3 className="font-display font-bold dark:text-white">Xavfsizlik</h3>
              <Field label="Joriy parol"><input type="password" className="input" placeholder="••••••••" /></Field>
              <Field label="Yangi parol"><input type="password" className="input" placeholder="Kamida 8 ta belgi" /></Field>
              <button className="btn-primary" onClick={() => toast('Parol yangilandi')}>Parolni yangilash</button>
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 p-4 text-sm text-emerald-700 dark:text-emerald-300 font-medium">✅ Ikki bosqichli autentifikatsiya (2FA) faol — +998 90 ••• 22 33</div></div>
          )}
          {sec === 'billing' && (
            <div className="max-w-lg space-y-4"><h3 className="font-display font-bold dark:text-white">Billing</h3>
              <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-indigo-700 text-white p-6"><p className="text-xs font-bold text-blue-200">HOZIRGI REJA</p><p className="font-display text-2xl font-extrabold">{plan}</p><p className="text-sm text-blue-100 mt-1">{plan === 'Professional' ? '890 000' : '290 000'} so‘m / oy • keyingi to‘lov 1-oktabr</p></div>
              <div className="grid grid-cols-2 gap-3">{['Start — 290K', 'Professional — 890K'].map((p) => {
                const pname = p.split(' — ')[0]
                return <button key={p} onClick={() => { setPlan(pname); localStorage.setItem('lawcrm_plan', pname); audit('Tarif o‘zgartirildi', pname); toast(`Reja: ${pname}`) }}
                  className={`rounded-2xl border-2 p-4 text-sm font-bold dark:text-white transition ${plan === pname ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-700'}`}>{p}{plan === pname && <span className="ml-2 text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full">FAOL</span>}</button>
              })}</div>
              <button className="btn-primary" onClick={() => setPlanModal(true)}>Tarifni yangilash</button></div>
          )}
          {sec === 'appearance' && (
            <div className="max-w-lg space-y-4"><h3 className="font-display font-bold dark:text-white">Ko‘rinish</h3>
              <div className="grid grid-cols-3 gap-3">
                {[['light', 'Light', Sun], ['dark', 'Dark', Moon], ['system', 'System', Monitor]].map(([v, l, Icon]) => (
                  <button key={v} onClick={() => { setTheme(v); toast(`${l} mavzu yoqildi`) }}
                    className={`p-4 rounded-2xl border-2 text-center transition ${theme === v ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-700'}`}>
                    <Icon size={20} className="mx-auto mb-1.5" /><p className="text-[13px] font-bold dark:text-white">{l}</p>
                    {theme === v && <Check size={14} className="mx-auto mt-1 text-brand-600" />}
                  </button>))}
              </div>
              <p className="text-xs text-slate-400">Asosiy standart — Light Mode. Dark mode to‘liq qo‘llab-quvvatlanadi.</p></div>
          )}
        </div>
      </div>
      <Modal open={planModal} onClose={() => setPlanModal(false)} title="Tarifni yangilash" width="max-w-sm">
        <div className="space-y-2.5">
          {[['Start', '290 000', '5 xodim, 100 mijoz'], ['Professional', '890 000', 'Cheksiz mijoz, AI agent, API']].map(([n, price, feat]) => (
            <button key={n} onClick={() => { setPlan(n); localStorage.setItem('lawcrm_plan', n); audit('Tarif o‘zgartirildi', n); setPlanModal(false); toast(`Reja: ${n}`) }}
              className={`w-full text-left p-4 rounded-2xl border-2 transition ${plan === n ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`}>
              <span className="flex items-center justify-between font-bold dark:text-white">{n} {plan === n && <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full">FAOL</span>}</span>
              <span className="block text-sm text-slate-500 mt-0.5">{price} so‘m/oy • {feat}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
