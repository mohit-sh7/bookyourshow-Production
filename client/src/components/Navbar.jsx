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
const SCROLL_THRESHOLD = 40;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [desktopHovered, setDesktopHovered] = useState(false); // desktop: cursor near the pill
  const [desktopPinned, setDesktopPinned] = useState(false); // fallback tap-to-expand on desktop touch trackpads
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // mobile: dropdown panel toggle
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pinnedRef = useRef(false);
  const desktopPillRef = useRef(null);
  const mobileNavRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const { user, favoriteMovies, logoutUser } = useAppContext();

  // Whole top bar shrinks on scroll unless something is actively holding it open
  const isBarCompact = scrolled && !desktopHovered && !desktopPinned && !mobileNavOpen;
  const isPillCompact = scrolled && !desktopHovered && !desktopPinned;

  useEffect(() => {
    pinnedRef.current = desktopPinned;
  }, [desktopPinned]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      if (pinnedRef.current) setDesktopPinned(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (desktopPillRef.current && !desktopPillRef.current.contains(e.target)) {
        setDesktopPinned(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setMobileNavOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const stop = (e) => e.stopPropagation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) navigate(`/movies?search=${encodeURIComponent(query)}`);
    setMobileNavOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full justify-center">
      <div className="mt-4 flex w-[95%] max-w-6xl flex-col">
        {/* Top bar — logo, desktop pill, profile/menu — always one row, never overlaps */}
        <div
          className={`
            flex items-center justify-between
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isBarCompact ? "h-12 px-4" : "h-16 md:h-20 px-4 md:px-6"}
          `}
        >
          {/* Logo */}
          <Link to="/" className="z-10 flex-shrink-0">
            <img
              src={assets.logo}
              alt="logo"
              className={`transition-all duration-500 ${
                isBarCompact ? "w-8" : "w-28 md:w-36"
              }`}
            />
          </Link>

          {/* Desktop-only hover pill — nav links + search */}
          <div
            ref={desktopPillRef}
            onMouseEnter={() => setDesktopHovered(true)}
            onMouseLeave={() => setDesktopHovered(false)}
            onClick={() => isPillCompact && setDesktopPinned(true)}
            className={`
              hidden md:flex items-center overflow-hidden
              rounded-full border border-white/10 bg-black/70 backdrop-blur-xl
              shadow-[0_0_25px_rgba(127,0,255,0.25)]
              transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${isPillCompact ? "cursor-pointer w-11 h-11 justify-center" : "px-6 h-14 gap-8 justify-center"}
            `}
          >
            {isPillCompact ? (
              <SearchIcon className="h-5 w-5 text-gray-300" />
            ) : (
              <>
                <nav className="flex items-center gap-6 flex-shrink-0">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item}
                      to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      onClick={stop}
                      className="group relative whitespace-nowrap text-sm font-medium text-gray-300 transition hover:text-white"
                    >
                      {item}
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                  ))}
                  {favoriteMovies.length > 0 && (
                    <Link
                      to="/favorite"
                      onClick={stop}
                      className="whitespace-nowrap text-sm text-gray-300 transition hover:text-white"
                    >
                      Favorites
                    </Link>
                  )}
                </nav>

                <form
                  onSubmit={handleSearchSubmit}
                  onClick={stop}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 flex-shrink-0"
                >
                  <SearchIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
                  <input
                    name="search"
                    type="text"
                    placeholder="Search"
                    className="w-24 bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
                  />
                </form>
              </>
            )}
          </div>

          {/* Right section — profile/login always visible; menu toggle only on mobile */}
          <div className="z-10 flex flex-shrink-0 items-center gap-2 md:gap-3">
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-primary px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium transition hover:scale-105"
              >
                Login
              </button>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className={`flex items-center justify-center rounded-full bg-primary font-semibold transition-all duration-500 ${
                    isBarCompact ? "h-8 w-8 text-sm" : "h-9 w-9 md:h-11 md:w-11 text-base md:text-lg"
                  }`}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-11 md:top-14 w-64 md:w-72 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl">
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

            {/* Mobile-only nav/search toggle */}
            <button
              className="rounded-full p-2 md:hidden"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            >
              {mobileNavOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel — drops below the top bar, never overlaps it */}
        <div
          ref={mobileNavRef}
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-out
            ${mobileNavOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}
          `}
          onClick={stop}
        >
          <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 mb-3">
              <SearchIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
              <input
                name="search"
                type="text"
                placeholder="Search movies"
                className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
              />
            </form>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setMobileNavOpen(false)}
                  className="py-3 px-2 text-sm font-medium text-gray-300 hover:text-white transition rounded-lg hover:bg-white/5"
                >
                  {item}
                </Link>
              ))}
              {favoriteMovies.length > 0 && (
                <Link
                  to="/favorite"
                  onClick={() => setMobileNavOpen(false)}
                  className="py-3 px-2 text-sm font-medium text-gray-300 hover:text-white transition rounded-lg hover:bg-white/5"
                >
                  Favorites
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;