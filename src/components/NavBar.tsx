import type { JSX } from 'react';
import { NavLink } from 'react-router-dom';

function NavBar(): JSX.Element {
  return (
    <div className="top-bar">
      <nav>
        <NavLink to="/">Garage</NavLink>
        <NavLink to="/winners">Winners</NavLink>
      </nav>
    </div>
  );
}

export default NavBar;