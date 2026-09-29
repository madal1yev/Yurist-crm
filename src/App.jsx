import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { Toasts } from './components/ui/kit'
import { useStore } from './store/StoreContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetails from './pages/ClientDetails'
import Cases from './pages/Cases'
import CaseDetails from './pages/CaseDetails'
import Calendar from './pages/Calendar'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Messages from './pages/Messages'
import Team from './pages/Team'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'
import Leads from './pages/Leads'
import Contracts from './pages/Contracts'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import AIAssistant from './pages/AIAssistant'
import Notifications from './pages/Notifications'
import ClientPortal from './pages/ClientPortal'
import ESign from './pages/ESign'
import Workflow from './pages/Workflow'
import Roles from './pages/Roles'
import AuditLog from './pages/AuditLog'
import Backup from './pages/Backup'

function RequireAuth({ children }) {
  const { authed } = useStore()
  return authed ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id" element={<CaseDetails />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="/esign" element={<ESign />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/team" element={<Team />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    <Toasts />
    </>
  )
}
