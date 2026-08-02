import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminSidebar = () => {

    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
    ]

    return (
        <aside
            className="
            hidden md:flex flex-col 
            h-[calc(100vh-80px)]
            w-56 
            p-5 
            rounded-xl
            ml-4 mt-4
            glass-card 
            border border-white/10
            shadow-[0_0_30px_rgba(127,0,255,0.12)]
            backdrop-blur-2xl
            overflow-hidden
            "
        >
            <div className="flex flex-col items-center gap-2 mb-6">
                <img
                    className="h-16 w-16 rounded-full border border-primary/40 shadow-[0_0_15px_rgba(127,0,255,0.3)]"
                    src={user.imageUrl}
                    alt="sidebar user"
                />
                <p className="text-base font-medium text-white/90 tracking-wide">
                    {user.firstName} {user.lastName}
                </p>
            </div>

            <nav className="mt-4 flex flex-col gap-2">
                {adminNavlinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        end
                        className={({ isActive }) => `
                            relative flex items-center gap-3
                            px-4 py-2.5 rounded-lg cursor-pointer
                            transition-all duration-300
                            group
                            ${isActive
                                ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(127,0,255,0.3)]"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon
                                    className={`
                                        w-5 h-5 transition
                                        ${isActive ? "text-primary" : "text-gray-400 group-hover:text-white"}
                                    `}
                                />
                                <span className="font-medium tracking-wide">{link.name}</span>

                                <span
                                    className={`
                                        absolute right-0 top-0 h-full w-1.5 rounded-l-lg
                                        transition-all duration-300
                                        ${isActive ? "bg-primary shadow-[0_0_10px_rgba(127,0,255,0.7)]" : "opacity-0"}
                                    `}
                                />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default AdminSidebar
