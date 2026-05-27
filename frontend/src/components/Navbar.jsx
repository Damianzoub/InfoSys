import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Navbar() {
  // useLocation makes this component re-render on every route change,
  // so localStorage is always fresh after login/logout navigation.
  useLocation();

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const role = user?.role;

  const linkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🐾 PetAdopt
      </NavLink>

      <div className="navbar-links">
        {/* Always visible */}
        <NavLink to="/pets" className={linkClass}>
          Υιοθεσίες
        </NavLink>

        {/* Not logged in */}
        {!user && (
          <NavLink to="/auth" className={linkClass}>
            Login / Register
          </NavLink>
        )}

        {/* Logged in as regular user */}
        {role === 'user' && (
          <NavLink to="/my-adoptions" className={linkClass}>
            Οι αιτήσεις μου
          </NavLink>
        )}

        {/* Logged in as shelter */}
        {role === 'shelter' && (
          <NavLink to="/shelter-dashboard" className={linkClass}>
            Καταφύγιο
          </NavLink>
        )}

        {/* Logged in as admin */}
        {role === 'admin' && (
          <NavLink to="/admin" className={linkClass}>
            Διαχείριση
          </NavLink>
        )}

        {/* Avatar — shown when logged in, links to profile (where logout lives) */}
        {user && (
          <NavLink to="/profile" className="nav-avatar" title={user.name}>
            {initials(user.name)}
          </NavLink>
        )}
      </div>
    </nav>
  );
}
