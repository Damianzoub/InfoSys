import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const linkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🐾 PetAdopt
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/pets" className={linkClass}>
          Υιοθεσίες
        </NavLink>
        <NavLink to="/my-adoptions" className={linkClass}>
          Οι αιτήσεις μου
        </NavLink>
        <NavLink to="/shelter-dashboard" className={linkClass}>
          Καταφύγιο
        </NavLink>
        <NavLink to="/admin" className={linkClass}>
          Admin
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Προφίλ
        </NavLink>
        <NavLink to="/auth" className={linkClass}>
          Login / Register
        </NavLink>
      </div>
    </nav>
  );
}
