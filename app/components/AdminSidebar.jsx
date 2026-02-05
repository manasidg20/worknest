"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  Calendar,
  DollarSign,
  Settings
} from "lucide-react";

export default function AdminSidebar() {

  const router = useRouter();

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-5 flex flex-col justify-between">

      <div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Clock />
          </div>

          <div>
            <h2 className="font-semibold text-lg">WorkForce</h2>
            <p className="text-sm text-gray-500">
              Attendance System
            </p>
          </div>
        </div>

        {/* MENU */}
        <Menu text="Dashboard" icon={<LayoutDashboard />} active />
        <Menu text="Attendance Management" icon={<Clock />} />
        <Menu text="Leave Management" icon={<Calendar />} />
        <Menu text="Salary Management" icon={<DollarSign />} />
        <Menu text="Profile & Settings" icon={<Settings />} />

      </div>

      <p className="text-sm text-gray-400">
        © 2026 WorkForce System
      </p>
    </div>
  );
}

function Menu({ text, icon, active }) {

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
        active ? "bg-blue-200 text-blue-700" : "hover:bg-gray-200"
      }`}
    >
      {icon}
      {text}
    </div>
  );
}
