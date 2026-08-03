import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  MenuIcon,
  SearchIcon,
  TicketPlus,
  XIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, favoriteMovies, logoutUser } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  
      
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full justify-center">
      <div
  className={`
    relative mt-4 flex w-[95%]
    items-center justify-between
    px-8 py-4
    transition-all duration-300
    ${isShrunk ? "h-16" : "h-20"}
  `}
>
        

        {/* Left section */}
        <Link to="/" className="z-10">
          <img
            src={assets.logo}
            alt="logo"
            className={`transition-all duration-300 ${
              isShrunk ? "w-28" : "w-36"
            }`}
          />
        </Link>

        {/* Center navigation */}
        <nav
  className="
    absolute left-1/2 -translate-x-1/2
    hidden md:flex items-center gap-10
    rounded-full border border-white/10
    bg-white/5 px-10 py-4 backdrop-blur-xl
    shadow-[0_0_25px_rgba(127,0,255,0.25)]
  "
>
          {["Home", "Movies", "Theaters", "Releases"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative text-sm font-medium text-gray-300 transition hover:text-white"
            >
              {item}

              <span
                className="
                  absolute left-0 top-6 h-[2px] w-0
                  rounded-full bg-primary transition-all
                  duration-300 hover:w-full
                "
              />
            </Link>
          ))}

          {favoriteMovies.length > 0 && (
            <Link
              to="/favorite"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Favorites
            </Link>
          )}
        </nav>

        {/* Right section */}
        <div className="z-10 flex items-center gap-5">
          <SearchIcon className="hidden h-5 w-5 cursor-pointer text-gray-300 md:block" />

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="
                rounded-full bg-primary
                px-6 py-2 text-sm font-medium
                transition hover:scale-105
              "
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full bg-primary text-lg font-semibold
                "
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </button>

              {showProfileMenu && (
                <div
                  className="
                    absolute right-0 top-14 w-72 rounded-2xl
                    border border-white/10 bg-black/90 p-4
                    backdrop-blur-xl
                  "
                >
                  <div className="border-b border-white/10 pb-4">
                    <p className="font-semibold">{user?.name}</p>

                    <p className="mt-1 text-sm text-gray-400">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="flex w-full items-center gap-3 py-4 hover:text-primary"
                  >
                    <TicketPlus size={18} />
                    My Bookings
                  </button>
                  <button
  onClick={() => navigate("/favorite")}
  className="flex w-full items-center gap-3 py-4 hover:text-primary"
>
   Favorites
</button>

                  <button
                    onClick={() => navigate("/profile")}
                    className="flex w-full items-center gap-3 py-4 hover:text-primary"
                  >
                    <Settings size={18} />
                    Profile Settings
                  </button>

                  <button
    onClick={logoutUser}
    className="flex w-full items-center gap-3 py-4 text-red-400"
>
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="rounded-lg p-2 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;