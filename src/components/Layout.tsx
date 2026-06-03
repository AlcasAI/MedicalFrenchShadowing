import { NavLink, Outlet, useLocation } from "react-router-dom";

const NAV = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/library", label: "Libreria", icon: "📚" },
  { to: "/shadowing", label: "Shadowing", icon: "🎙️" },
  { to: "/passive", label: "Passivo", icon: "🎧" },
  { to: "/progress", label: "Progressi", icon: "📈" },
];

export default function Layout() {
  const loc = useLocation();
  const hideNav = loc.pathname === "/passive";
  return (
    <div className="app-frame">
      <div className="app-content">
        <Outlet />
      </div>
      {!hideNav && (
        <nav className="bottom-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
