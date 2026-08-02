import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <header className="w-full z-50">
      <div
        className="
          glass-card 
          flex items-center justify-between
          h-16 
          px-6 md:px-10 
          border border-white/10 
          rounded-xl 
          mx-4 mt-4
          shadow-[0_0_25px_rgba(127,0,255,0.15)]
          backdrop-blur-lg
        "
      >
        <Link to="/" className="flex items-center">
          <img
            src={assets.logo}
            alt="logo"
            className="w-32 md:w-36 h-auto drop-shadow-[0_0_10px_rgba(127,0,255,0.4)]"
          />
        </Link>

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 
                        rounded-full bg-primary/20 border border-primary/30 
                        text-primary font-medium text-sm tracking-wide">
          Admin Panel
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar
