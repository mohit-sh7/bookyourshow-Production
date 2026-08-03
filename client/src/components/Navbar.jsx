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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pinned, setPinned] = useState(false); // true right after a click "pops" it open
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pinnedRef = useRef(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, favoriteMovies, logoutUser } = useAppContext();

  // The island is compact only when scrolled AND not currently pinned open
  const isCompact = scrolled && !pinned;

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > SCROLL_THRESHOLD);

      // Any further scrolling releases the pin so the island can react
      // to the new scroll position again (this is what makes it re-shrink
      // after the user taps it open and keeps scrolling).
      if (pinnedRef.current) {
        setPinned(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  // Tapping the island while it's compact "pops" it back to full size
  const handleIslandClick = () => {
    if (isCompact) {
      setPinned(true);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full justify-center">
      <div
        onClick={handleIslandClick}
        className={`
          relative mt-4 flex flex-col
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isCompact ? "cursor-pointer" : ""}
        `}
      >
        <div
          className={`
            flex items-center
            rounded-full border border-white/10 bg-black/70 backdrop-blur-xl
            shadow-[0_0_25px_rgba(127,0,255,0.25)]
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            overflow-hidden
            ${
              isCompact
                ? "w-[150px] h-11 px-3 justify-center gap-2"
                : "w-[95vw] max-w-5xl h-16 md:h-20 px-4 md:px-8 py-3 md:py-4 justify-between"
            }
          `}
        >
          {/* Logo — always visible, shrinks with the island */}
          <Link
            to="/"
            className="z-10 flex-shrink-0"
            onClick={(e) => {
              stop(e);
              if (isCompact) e.preventDefault(); // first tap just expands, doesn't navigate
            }}
          >
            <img
              src={assets.logo}
              alt="logo"
              className={`transition-all duration-500 ${
                isCompact ? "w-8" : "w-28 md:w-36"
              }`}
            />
          </Link>

          {/* Compact-mode hint: small avatar/dot so it doesn't look like a dead pill */}
          {isCompact && (
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}

          {/* Center navigation (desktop, expanded only) */}
          {!isCompact && (
            <nav
              className="
                hidden md:flex items-center gap-8
                absolute left-1/2 -translate-x-1/2
              "
              onClick={stop}
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="group relative text-sm font-medium text-gray-300 transition hover:text-white"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
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
          )}

          {/* Right section (expanded only) */}
          {!isCompact && (
            <div
              className="z-10 flex items-center gap-3 md:gap-5"
              onClick={stop}
            >
              <SearchIcon className="hidden h-5 w-5 cursor-pointer text-gray-300 md:block" />

              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-primary px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium transition hover:scale-105"
                >
                  Login
                </button>
              ) : (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-primary text-base md:text-lg font-semibold"
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 md:top-14 w-64 md:w-72 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl">
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
          )}
        </div>

        {/* Mobile dropdown menu (only reachable when expanded) */}
        {!isCompact && (
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-300 ease-out
              ${isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}
            `}
            onClick={stop}
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
        )}
      </div>
    </header>
  );
};

export default Navbar;