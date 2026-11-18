import { useContext, useState } from "react";
import {
  FaHome,
  FaUserFriends,
  FaBell,
  FaFacebookMessenger,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { AuthCreateContext } from "../../context/authContext";
import { BiLogOutCircle } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", icon: <FaHome />, path: "/home" },
    { name: "Profile", icon: <FaUserFriends />, path: "/profile" },

    { name: "Notifications", icon: <FaBell />, path: "/notifications" },
    { name: "Messages", icon: <FaFacebookMessenger /> },
  ];

  const { token, clearAuthToken } = useContext(AuthCreateContext);

  const { data: notifData } = useQuery({
    queryKey: ["notifications", "navbar"],
    queryFn: () =>
      axios.get("https://route-posts.routemisr.com/notifications", {
        params: { unread: false, page: 1, limit: 50 },
        headers: { token },
        Authorization: `Bearer ${token}`,
      }),
    enabled: !!token,
  });

  const unreadCount =
    notifData?.data?.data?.notifications?.filter((n: any) => !n.isRead)
      .length ?? 0;

  // console.log(
  //   "total:",
  //   notifData?.data?.data?.notifications?.length,
  //   "| unreadCount:",
  //   unreadCount,
  // );
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-600">
            Social<span className="text-gray-800">Hub</span>
          </h1>

          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search SocialHub..."
              className="bg-transparent outline-none px-3 w-full text-sm"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 h-full rounded-2xl">
          {navLinks.slice(0, 3).map(({ name, icon, path }) => (
            <NavLink
              to={path}
              key={name}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 h-full text-sm font-semibold transition-all rounded-2xl ${
                  isActive
                    ? "bg-sky-100 text-sky-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span className="relative text-lg">
                {icon}
                {name === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              <span>{name}</span>
            </NavLink>
          ))}
          {/* Notifications */}
        </div>

        {token ? (
          <button
            type="button"
            onClick={clearAuthToken}
            className="flex cursor-pointer items-center gap-2 px-5 h-full text-sm font-semibold transition-allrounded-2xl"
          >
            <BiLogOutCircle />
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Messages */}
          <button
            onClick={() => setActive("Messages")}
            className="relative bg-gray-100 hover:bg-gray-200 p-3 rounded-full text-gray-600 text-lg"
            title="Messages"
          >
            <FaFacebookMessenger />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="font-semibold text-sm">Ahmed</span>
            <FaChevronDown className="text-gray-500 text-xs" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg p-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none px-3 w-full"
            />
          </div>

          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={`flex items-center gap-4 w-full p-3 rounded-lg mb-1
                ${
                  active === link.name
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}

          <div className="border-t mt-3 pt-3 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">Ahmed</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
