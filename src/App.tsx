import { Routes, Route, Navigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'

export default function App() {
  const count = useLiveQuery(() => db.profile.count(), [], null)
  if (count === null) return null
  const hasProfile = count > 0

  return (
    <Routes>
      <Route
        path="/"
        element={hasProfile ? <Home /> : <Navigate to="/bienvenida" replace />}
      />
      <Route
        path="/bienvenida"
        element={hasProfile ? <Navigate to="/" replace /> : <Onboarding />}
      />
    </Routes>
  )
}