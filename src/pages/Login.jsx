import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useStore } from '../store/StoreContext'

export default function Login() {
  const { authed, login, toast } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [remember, setRemember] = useState(true)

  if (authed) return <Navigate to="/dashboard" replace />

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('Email manzilni to‘g‘ri kiriting')
    if (password.length < 4) return setErr('Parol kamida 4 ta belgidan iborat bo‘lishi kerak')
    login(email, email.split('@')[0])
    toast('Tizimga kirdingiz')
    navigate('/dashboard', { replace: true })
  }

  const demo = () => {
    login('demo@lawcrm.uz', 'Demo Foydalanuvchi')
    toast('Demo akkauntga kirdingiz')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F6F8FC]">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-12 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -left-20 bottom-10 w-72 h-72 rounded-full bg-white/5" />
        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center"><Scale size={22} /></div>
          <span className="font-display font-extrabold text-xl">LawCRM</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl font-extrabold leading-tight">Yuridik biznesingizni<br />bitta tizimda boshqaring</h2>
          <p className="text-blue-100 mt-4 max-w-md">Mijozlar, sud ishlari, hujjatlar, to‘lovlar va jamoa — barchasi xavfsiz bulut platformada.</p>
          <div className="mt-8 space-y-3">
            {['Mijozlar va ishlar nazorati', 'Hujjatlar arxivi va e-imzo', 'Analitika va avtomatlashtirish'].map((x) => (
              <div key={x} className="flex items-center gap-2.5 text-sm text-blue-50"><ShieldCheck size={16} /> {x}</div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-blue-200">© 2026 LawCRM · Legal Tech SaaS</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center"><Scale size={20} /></div>
            <span className="font-display font-extrabold text-lg">LawCRM</span>
          </Link>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Tizimga kirish</h1>
          <p className="text-sm text-slate-500 mt-1">Hisobingizga kiring yoki demo akkauntni sinab ko‘ring.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500">Email</label>
              <div className="relative mt-1.5">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="siz@lawcrm.uz" autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Parol</label>
              <div className="relative mt-1.5">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 font-medium text-slate-500 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded" /> Eslab qolish
              </label>
              <button type="button" onClick={() => toast('Parolni tiklash havolasi emailga yuborildi', 'info')} className="font-bold text-blue-600 hover:underline">Parolni tiklash</button>
            </div>

            {err && <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-3.5 py-2.5">{err}</div>}

            <button type="submit" className="btn-primary w-full !py-3 !text-[15px]">Kirish <ArrowRight size={17} /></button>
          </form>

          <div className="flex items-center gap-3 my-5"><span className="flex-1 h-px bg-slate-200" /><span className="text-xs font-semibold text-slate-400">YOKI</span><span className="flex-1 h-px bg-slate-200" /></div>

          <button onClick={demo} className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-blue-100 bg-blue-50 text-blue-700 font-bold py-3 hover:bg-blue-100 transition">
            <Sparkles size={17} /> Demo akkaunt bilan kirish
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Hisobingiz yo‘qmi? <Link to="/" className="font-bold text-blue-600 hover:underline">Boshlash</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
