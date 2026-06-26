"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Aperture, LayoutDashboard, User, Image, CalendarCheck, 
  Settings, LogOut, Menu 
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Image },
  { name: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const userName = session?.user?.name || "Professional";
  const userEmail = session?.user?.email || "";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center">
            <Aperture className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Shootly</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-amber-50 text-amber-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-amber-600" : "text-slate-400"}`} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-amber-700">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{userName}</div>
            <div className="text-xs text-slate-400 truncate">{userEmail}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-slate-200"
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 flex-shrink-0">
            <SidebarContent />
          </div>
          <button className="flex-1 bg-black/20" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="hidden lg:block w-72 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}