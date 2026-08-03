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
  Heart,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const NAV_ITEMS = ["Home", "Movies", "Theaters", "Releases"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [locked, setLocked] = useState(false); // true while user has clicked to force expanded state
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, favoriteMovies, logoutUser } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      if (locked) return; // don't let scroll override the manually-expanded state
      setIsShrunk(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [locked]);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  // Close the mobile menu automatically if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click anywhere on the navbar shell to force it back to full size.
  // While "locked", scroll won't re-shrink it until the user scrolls again after unlocking,
  // or you can choose to auto-unlock on next scroll — see toggleLock below.
  const toggleLock = () => {
    if (isShrunk || locked) {
      setIsShrunk(false);
      setLocked((prev) => !prev);
    }
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full justify-center">
      <div
        onClick={toggleLock}
        className={`
          relative mt-4 flex w-[95%] flex-col
          transition-all duration-300
        `}
      >
        <div
          className={`
            flex items-center justify-between
            px-4 md:px-8 py-3 md:py-4
            transition-all duration-300
            ${isShrunk ? "h-14 md:h-16" : "h-16 md:h-20"}
          `}
        >
          {/* Left section */}
          <Link to="/" className="z-10" onClick={(e) => e.stopPropagation()}>
            <img
              src={assets.logo}
              alt="logo"
              className={`transition-all duration-300 ${
                isShrunk ? "w-24 md:w-28" : "w-28 md:w-36"
              }`}
            />
          </Link>

          {/* Center navigation (desktop) */}
          <nav
            className="
              absolute left-1/2 -translate-x-1/2
              hidden md:flex items-center gap-10
              rounded-full border border-white/10
              bg-white/5 px-10 py-4 backdrop-blur-xl
              shadow-[0_0_25px_rgba(127,0,255,0.25)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="group relative text-sm font-medium text-gray-300 transition hover:text-white"
              >
                {item}
                <span
                  className="
                    absolute left-0 -bottom-1 h-[2px] w-0
                    rounded-full bg-primary transition-all
                    duration-300 group-hover:w-full
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
          <div className="z-10 flex items-center gap-3 md:gap-5" onClick={(e) => e.stopPropagation()}>
            <SearchIcon className="hidden h-5 w-5 cursor-pointer text-gray-300 md:block" />

            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="
                  rounded-full bg-primary
                  px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium
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
                    flex h-9 w-9 md:h-11 md:w-11 items-center justify-center
                    rounded-full bg-primary text-base md:text-lg font-semibold
                  "
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </button>

                {showProfileMenu && (
                  <div
                    className="
                      absolute right-0 top-12 md:top-14 w-64 md:w-72 rounded-2xl
                      border border-white/10 bg-black/90 p-4
                      backdrop-blur-xl
                    "
                  >
                    <div className="border-b border-white/10 pb-4">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="mt-1 text-sm text-gray-400">{user?.email}</p>
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
                      <Heart size={18} />
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
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-out
            ${isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={closeMobileMenu}
                className="py-3 px-2 text-sm font-medium text-gray-300 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                {item}
              </Link>
            ))}

            {favoriteMovies.length > 0 && (
              <Link
                to="/favorite"
                onClick={closeMobileMenu}
                className="py-3 px-2 text-sm font-medium text-gray-300 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Favorites
              </Link>
            )}

            <div className="flex items-center gap-2 py-3 px-2 text-sm font-medium text-gray-300">
              <SearchIcon className="h-4 w-4" />
              Search
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;