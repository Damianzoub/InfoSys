import { NavLink } from 'react-router-dom';
import './Navbar.css';

function navClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const role = user?.role;

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🐾 PetAdopt
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/pets" className={navClass}>
          Υιοθεσίες
        </NavLink>

        {role === 'user' && (
          <NavLink to="/my-adoptions" className={navClass}>
            Οι αιτήσεις μου
          </NavLink>
        )}

        {role === 'shelter' && (
          <NavLink to="/shelter/dashboard" className={navClass}>
            Πίνακας Καταφυγίου
          </NavLink>
        )}

        {role === 'admin' && (
          <NavLink to="/admin" className={navClass}>
            Διαχείριση
          </NavLink>
        )}

        {!user ? (
          <NavLink to="/auth" className={navClass}>
            Σύνδεση
          </NavLink>
        ) : (
          <NavLink to="/profile" className="nav-avatar" title={user.name}>
            {initials(user.name)}
          </NavLink>
        )}
      </div>
    </nav>
  );
}
