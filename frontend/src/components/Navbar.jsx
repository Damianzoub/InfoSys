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
        <NavLink to="/auth" className={({ isActive }) =>isActive ? 'nav-link active' : 'nav-link'}>
        Login / Register
        </NavLink>
      </div>
    </nav>
  );
}
