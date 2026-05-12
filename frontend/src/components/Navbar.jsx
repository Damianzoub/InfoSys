import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🐾 PetAdopt
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/pets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Υιοθεσίες
        </NavLink>
        {/* Auth links — Βήμα 6 (Αλεσία) */}
        {/* <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Σύνδεση
        </NavLink> */}
        {/* <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link btn-register active' : 'nav-link btn-register'}>
          Εγγραφή
        </NavLink> */}
      </div>
    </nav>
  );
}
