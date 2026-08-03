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
const SCROLL_THRESHOLD = 40; // px scrolled before the island starts shrinking

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false); // desktop: cursor near the pill
  const [pinned, setPinned] = useState(false); // mobile: tapped open
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pinnedRef = useRef(false);
  const islandRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const { user, favoriteMovies, logoutUser } = useAppContext();

  // Compact only once scrolled, and only while nothing is holding it open
  const isCompact = scrolled && !hovered && !pinned;

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      // further scrolling releases a mobile tap-pin so it can react again
      if (pinnedRef.current) setPinned(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tapping outside the pill (mobile) collapses it
  useEffect(() => {
    const handleOutside = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        setPinned(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handlePillClick = () => {
    // On touch devices there's no hover, so tapping the compact pill pops it open
    if (isCompact) setPinned(true);
  };

  const stop = (e) => e.stopPropagation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) navigate(`/movies?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 md:px-8 pt-4">
      {/* Logo — always visible, independent of the island */}
      <Link to="/" className="z-10 flex-shrink-0">
        <img src={assets.logo} alt="logo" className="w-28 md:w-36" />
      </Link>

      {/* Center island: nav links + search only */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <div
          ref={islandRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handlePillClick}
          className={`
            flex items-center overflow-hidden
            rounded-full border border-white/10 bg-black/70 backdrop-blur-xl
            shadow-[0_0_25px_rgba(127,0,255,0.25)]
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isCompact ? "cursor-pointer" : ""}
            ${
              isCompact
                ? "w-11 h-11 justify-center"
                : "w-[90vw] max-w-2xl h-12 md:h-14 px-4 md:px-6 justify-center gap-5 md:gap-8"
            }
          `}
        >
          {isCompact ? (
            <SearchIcon className="h-5 w-5 text-gray-300" />
          ) : (
            <>
              <nav className="flex items-center gap-4 md:gap-8 flex-shrink-0 overflow-x-auto no-scrollbar">
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
                  className="w-24 md:w-32 bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
                />
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right section — always visible, independent of the island */}
      <div className="z-10 flex flex-shrink-0 items-center gap-3">
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
              className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-primary text-base md:text-lg font-semibold"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 md:top-14 w-64 md:w-72 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl">
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
      </div>
    </header>
  );
};

export default Navbar;