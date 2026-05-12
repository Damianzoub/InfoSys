import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import PetListPage from './pages/PetListPage'
import PetProfilePage from './pages/PetProfilePage'
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
          {/* Βήμα 6 — Auth routes (Αλεσία) */}
          {/* <Route path="/login"    element={<LoginPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
