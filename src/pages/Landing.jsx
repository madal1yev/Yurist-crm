import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Scale, ArrowRight, Users, FileText, BarChart3, ShieldCheck, Zap, Check,
  Phone, Mail, MapPin, Send, Instagram, Facebook, Youtube, Menu, X
} from 'lucide-react'

const NAV = [
  ['#features', 'Imkoniyatlar'],
  ['#pricing', 'Tariflar'],
  ['#contact', 'Aloqa'],
  ['#about', 'Biz haqimizda']
]

const PLANS = [
  { name: 'Start', price: '290 000', tag: 'Kichik amaliyot uchun', feats: ['5 ta xodim', '100 mijoz', 'Hujjatlar arxivi', 'Email yordam'], hot: false },
  { name: 'Professional', price: '890 000', tag: 'Eng ko‘p tanlanadi', feats: ['Cheksiz xodim va mijoz', 'AI Yurist agent', 'E-imzo va workflow', 'Telegram integratsiya', 'Ustuvor yordam'], hot: true },
  { name: 'Enterprise', price: 'Kelishilgan', tag: 'Yirik firmalar uchun', feats: ['API va webhook', 'SSO / 2FA', 'Shaxsiy server', 'SLA kafolati', '24/7 qo‘llab-quvvatlash'], hot: false }
]

export default function Landing() {
  const [menu, setMenu] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const feats = [
    { icon: Users, t: 'Mijozlar bazasi', d: 'Barcha mijozlar, tarix va hujjatlar bitta joyda.' },
    { icon: Scale, t: 'Case management', d: 'Sud ishlari, deadlinelar va vazifalar nazorati.' },
    { icon: FileText, t: 'Hujjatlar arxivi', d: 'Shartnoma va sud hujjatlari tartibli saqlanadi.' },
    { icon: BarChart3, t: 'Analitika', d: 'Daromad, ishlar va jamoa samaradorligi.' },
    { icon: ShieldCheck, t: 'Xavfsizlik', d: 'Rollar, ruxsatlar va 2FA himoya.' },
    { icon: Zap, t: 'Avtomatlashtirish', d: 'Eslatmalar, hisoblar va hisobotlar avtomatik.' }
  ]

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    try {
      const prev = JSON.parse(localStorage.getItem('lawcrm_landing_leads') || '[]')
      localStorage.setItem('lawcrm_landing_leads', JSON.stringify([{ ...form, at: new Date().toISOString() }, ...prev].slice(0, 100)))
    } catch {}
    setSent(true)
    setForm({ name: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25"><Scale size={20} /></div>
            <span className="font-display font-extrabold text-lg">LawCRM</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition">{label}</a>
            ))}
          </nav>
          <div className="flex-1" />
          <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 hidden sm:block">Kirish</Link>
          <Link to="/login" className="btn-primary !py-2.5">Bepul boshlash <ArrowRight size={16} /></Link>
          <button onClick={() => setMenu(!menu)} className="md:hidden p-2.5 rounded-xl hover:bg-slate-100">{menu ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {menu && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-3 space-y-1">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">{label}</a>
            ))}
            <Link to="/login" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50">Kirish</Link>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 pt-10 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full ring-1 ring-blue-100">⚖️ Yuridik kompaniyalar uchun #1 CRM</span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mt-5 leading-[1.05]">Yuridik biznesingizni<br /><span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">bitta tizimda</span> boshqaring</h1>
          <p className="text-slate-500 text-base sm:text-lg mt-4 max-w-xl mx-auto">Mijozlar, sud ishlari, to‘lovlar, hujjatlar va jamoa — barchasi professional LawCRM platformasida.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Link to="/login" className="btn-primary !px-7 !py-3.5 !text-[15px]">Demo CRMni ko‘rish <ArrowRight size={17} /></Link>
            <a href="#pricing" className="btn-ghost !px-7 !py-3.5 !text-[15px]">Tariflarni ko‘rish</a>
          </div>
          <div className="flex justify-center gap-8 mt-10">
            {[['120+', 'Mijoz kompaniya'], ['4.9★', 'Reyting'], ['97%', 'Mamnunlik']].map(([v, l]) => (
              <div key={l}><p className="font-display text-2xl sm:text-3xl font-extrabold">{v}</p><p className="text-xs text-slate-400 font-semibold">{l}</p></div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-12 mx-auto max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-pop overflow-hidden text-left">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
            <span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-amber-400" /><span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-semibold text-slate-400">app.lawcrm.uz/dashboard</span>
          </div>
          <div className="grid sm:grid-cols-[180px_1fr]">
            <div className="hidden sm:block border-r border-slate-100 p-3 space-y-1.5 bg-slate-50/40">
              {['Dashboard', 'Mijozlar', 'Yuridik ishlar', 'Kalendar', 'To‘lovlar', 'Analitika'].map((l, i) => (
                <div key={l} className={`text-xs font-bold px-3 py-2 rounded-xl ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>{l}</div>
              ))}
            </div>
            <div className="p-5">
              <p className="text-xs font-bold text-slate-400">DAROMAD DINAMIKASI</p>
              <div className="flex items-end gap-2 h-28 mt-3">{[40, 55, 48, 70, 85, 95, 78, 100, 88, 92, 76, 98].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-lg ${i === 7 ? 'bg-gradient-to-t from-blue-600 to-indigo-400' : 'bg-blue-100'}`} style={{ height: h + '%' }} />))}</div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[['Jami mijozlar', '118'], ['Faol ishlar', '43'], ['Tushum', '79M']].map(([l, v]) => (
                  <div key={l} className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] font-bold text-slate-400">{l}</p><p className="font-display font-extrabold">{v}</p></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-5 pb-16 scroll-mt-20">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-center">Hamma narsa bitta platformada</h2>
        <p className="text-slate-500 text-center mt-2">Yuridik amaliyotingiz uchun zarur bo‘lgan barcha vositalar.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {feats.map((f, i) => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-card hover:shadow-pop hover:-translate-y-1 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-3"><f.icon size={20} /></div>
              <h3 className="font-bold">{f.t}</h3><p className="text-sm text-slate-500 mt-1">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="max-w-6xl mx-auto px-5 pb-16 scroll-mt-20">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-center">Oddiy va shaffof tariflar</h2>
        <p className="text-slate-500 text-center mt-2">14 kun bepul sinov • karta talab qilinmaydi.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-3xl border p-6 bg-white relative ${p.hot ? 'border-blue-600 shadow-pop ring-1 ring-blue-100 md:-translate-y-2' : 'border-slate-200/70 shadow-card'}`}>
              {p.hot && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-extrabold bg-blue-600 text-white px-3 py-1 rounded-full">MASHHUR</span>}
              <h3 className="font-display text-lg font-extrabold">{p.name}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">{p.tag}</p>
              <p className="mt-4"><span className="font-display text-3xl font-extrabold">{p.price}</span>{p.price !== 'Kelishilgan' && <span className="text-sm text-slate-400 font-semibold"> so‘m/oy</span>}</p>
              <ul className="mt-5 space-y-2.5">
                {p.feats.map((f) => <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600"><Check size={16} className="text-blue-600 shrink-0" /> {f}</li>)}
              </ul>
              <Link to="/login" className={`mt-6 flex items-center justify-center gap-2 rounded-2xl font-bold py-3 transition ${p.hot ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'}`}>
                Tanlash <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="max-w-6xl mx-auto px-5 pb-16 scroll-mt-20">
        <div className="rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold">14 kun bepul sinab ko‘ring</h2>
          <p className="text-blue-100 mt-2">Karta talab qilinmaydi • 5 daqiqada sozlash</p>
          <div className="flex flex-wrap justify-center gap-2.5 mt-6 text-sm font-semibold">
            {['Mijozlar', 'Case tracking', 'Hisoblar', 'Kalendar'].map((t) => <span key={t} className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full"><Check size={14} /> {t}</span>)}
          </div>
          <Link to="/login" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-2xl mt-7 hover:bg-blue-50 transition">Hoziroq boshlash <ArrowRight size={17} /></Link>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="max-w-6xl mx-auto px-5 pb-16 scroll-mt-20">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">Biz bilan bog‘laning</h2>
            <p className="text-slate-500 mt-2">Savollaringiz bormi? Mutaxassislarimiz 1 ish kuni ichida javob beradi.</p>
            <div className="space-y-3 mt-6">
              {[[Phone, 'Telefon', '+998 71 200 45 67', 'tel:+998712004567'],
                [Mail, 'Email', 'info@lawcrm.uz', 'mailto:info@lawcrm.uz'],
                [MapPin, 'Ofis', 'Toshkent sh., Amir Temur shoh ko‘chasi, 15-uy', null]].map(([Icon, l, v, href]) => (
                <div key={l} className="flex items-start gap-3.5 bg-white rounded-2xl border border-slate-200/70 p-4">
                  <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Icon size={18} /></span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{l}</p>
                    {href ? <a href={href} className="text-sm font-bold text-slate-700 hover:text-blue-600">{v}</a> : <p className="text-sm font-bold text-slate-700">{v}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-4">
              {[[Send, 'https://t.me/lawcrm'], [Instagram, 'https://instagram.com/lawcrm'], [Facebook, 'https://facebook.com/lawcrm'], [Youtube, 'https://youtube.com/@lawcrm']].map(([Icon, href]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition"><Icon size={17} /></a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-card p-6 sm:p-7">
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto"><Check size={30} /></div>
                <h3 className="font-display text-xl font-extrabold mt-4">Murojaatingiz yuborildi!</h3>
                <p className="text-sm text-slate-500 mt-1.5">Tez orada siz bilan bog‘lanamiz.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-5">Yana xabar yuborish</button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-lg font-extrabold">Xabar qoldiring</h3>
                <form onSubmit={submit} className="mt-4 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500">Ismingiz *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Abdulla Karimov"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500">Telefon *</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500">Xabar</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Qanday yordam kerak?"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full !py-3">Yuborish <Send size={16} /></button>
                  <p className="text-[11px] text-slate-400 text-center">Shaxsiy ma’lumotlaringiz maxfiy saqlanadi.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-6xl mx-auto px-5 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white"><Scale size={20} /></div>
              <span className="font-display font-extrabold text-lg text-white">LawCRM</span>
            </div>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">Yuridik kompaniyalar uchun zamonaviy CRM platforma. Mijozlar, ishlar va hujjatlar bitta tizimda.</p>
            <div className="flex gap-2 mt-4">
              {[[Send, 'https://t.me/lawcrm'], [Instagram, 'https://instagram.com/lawcrm'], [Facebook, 'https://facebook.com/lawcrm'], [Youtube, 'https://youtube.com/@lawcrm']].map(([Icon, href]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-600 flex items-center justify-center transition"><Icon size={16} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Platforma</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {['Mijozlar bazasi', 'Case management', 'Hujjatlar arxivi', 'Analitika', 'AI Yurist agent'].map((x) => <li key={x}><a href="#features" className="text-slate-400 hover:text-white transition">{x}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Kompaniya</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {[['Biz haqimizda', '#about'], ['Tariflar', '#pricing'], ['Aloqa', '#contact'], ['Kirish', '/login']].map(([x, href]) => (
                <li key={x}>{href.startsWith('/') ? <Link to={href} className="text-slate-400 hover:text-white transition">{x}</Link> : <a href={href} className="text-slate-400 hover:text-white transition">{x}</a>}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Aloqa</h4>
            <ul className="mt-3 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5"><Phone size={15} className="text-blue-500" /> <a href="tel:+998712004567" className="hover:text-white transition">+998 71 200 45 67</a></li>
              <li className="flex items-center gap-2.5"><Mail size={15} className="text-blue-500" /> <a href="mailto:info@lawcrm.uz" className="hover:text-white transition">info@lawcrm.uz</a></li>
              <li className="flex items-start gap-2.5"><MapPin size={15} className="text-blue-500 mt-0.5" /> Toshkent sh., Amir Temur shoh k., 15-uy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 LawCRM • Barcha huquqlar himoyalangan</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition">Maxfiylik siyosati</a>
              <a href="#" className="hover:text-white transition">Foydalanish shartlari</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
