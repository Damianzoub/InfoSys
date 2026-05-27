import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import PetListPage from './pages/PetListPage'
import PetProfilePage from './pages/PetProfilePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import MyAdoptionsPage from './pages/MyAdoptionsPage'
import ShelterDashboardPage from './pages/ShelterDashboardPage'
import AdminPanelPage from './pages/AdminPanelPage'
import AdoptionForm from "./pages/AdoptionForm";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/pets" replace />} />
          <Route path="/pets" element={<PetListPage />} />
          <Route path="/pets/:id" element={<PetProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-adoptions" element={<MyAdoptionsPage />} />
          <Route path="/shelter-dashboard" element={<ShelterDashboardPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
