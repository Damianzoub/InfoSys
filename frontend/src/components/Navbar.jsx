import { NavLink } from 'react-router-dom';
import './Navbar.css';

function navClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

export default function Navbar() {
  // Read user from localStorage (set on login by auth flow)
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const role = user?.role; // 'user' | 'shelter' | 'admin' | undefined

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🐾 PetAdopt
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/pets" className={navClass}>
          Υιοθεσίες
        </NavLink>

        {/* Links visible when logged in as regular user */}
        {role === 'user' && (
          <NavLink to="/my-adoptions" className={navClass}>
            Οι αιτήσεις μου
          </NavLink>
        )}

        {/* Links visible when logged in as shelter */}
        {role === 'shelter' && (
          <NavLink to="/shelter/dashboard" className={navClass}>
            Πίνακας Καταφυγίου
          </NavLink>
        )}

        {/* Links visible when logged in as admin */}
        {role === 'admin' && (
          <NavLink to="/admin" className={navClass}>
            Διαχείριση
          </NavLink>
        )}

        {/* Auth link — shown when not logged in */}
        {!user && (
          <NavLink to="/auth" className={navClass}>
            Σύνδεση
          </NavLink>
        )}
      </div>
    </nav>
  );
}
