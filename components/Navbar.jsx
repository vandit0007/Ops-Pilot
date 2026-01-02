import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="h-14 px-6 flex items-center justify-between bg-neutral-900 border-b border-neutral-800">
      <Link to="/dashboard" className="font-bold text-white">
        OpsPilot
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <Link to="/dashboard" className="text-neutral-300 hover:text-white">
          Dashboard
        </Link>

        {user?.role === "admin" && (
          <Link to="/analytics" className="text-neutral-300 hover:text-white">
            Analytics
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
