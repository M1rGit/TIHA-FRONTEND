import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { DashboardPage } from './pages/DashboardPage'
import { ErrorPage } from './pages/ErrorPage'
import { FilesPage } from './pages/FilesPage'
import { InfoPage } from './pages/InfoPage'
import { LinksPage } from './pages/LinksPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { SchedulePage } from './pages/SchedulePage'

export function App() {
  const { error } = useAuth()

  if (error) {
    return <ErrorPage status={error.status} body={error.body} />
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/files" element={<FilesPage />} />
      </Route>
      <Route path="*" element={<ErrorPage status={404} />} />
    </Routes>
  )
}
