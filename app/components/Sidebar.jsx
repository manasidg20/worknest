"use client";

import {
  LayoutDashboard,
  Clock,
  BarChart,
  Calendar,
  User,
  Settings
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-5 flex flex-col justify-between">

      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Clock />
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              WorkNest
            </h2>

            <p className="text-sm text-gray-500">
              Attendance System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">

          <MenuItem
            icon={<LayoutDashboard />}
            text="Dashboard"
            active={pathname === "/dashboard"}
            onClick={() => router.push("/dashboard")}
          />

          <MenuItem
            icon={<Clock />}
            text="Attendance"
            active={pathname === "/attendance"}
            onClick={() => router.push("/attendance")}
          />

          <MenuItem
            icon={<BarChart />}
            text="Weekly Summary"
            active={pathname === "/weekly-summary"}
            onClick={() => router.push("/weekly-summary")}
          />

          <MenuItem
            icon={<Calendar />}
            text="Leave"
            onClick={() => router.push("/leave")}
          />

          <MenuItem
            icon={<User />}
            text="Profile"
            onClick={() => router.push("/profile")}
          />

          <MenuItem
            icon={<Settings />}
            text="Settings"
            onClick={() => router.push("/settings")}
          />

        </nav>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-400">
        © 2026 WorkNest
      </p>
    </div>
  );
}

/* -------- Menu Item Component -------- */

function MenuItem({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
        active
          ? "bg-blue-200 text-blue-700"
          : "hover:bg-gray-200"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
