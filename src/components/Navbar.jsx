import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <Link to="/dashboard">Dashboard</Link> | 
      <Link to="/tracks">Tracks</Link> | 
      <Link to="/alerts">Alerts</Link>
    </div>
  );
}

export default Navbar;