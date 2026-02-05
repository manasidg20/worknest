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
    <div className="w-64 bg-white min-h-screen p-5 border-r flex flex-col justify-between">

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

        {/* Menu */}
        <nav className="space-y-2">

          <Item
            icon={<LayoutDashboard />}
            text="Dashboard"
            active
            onClick={() => router.push("/admin/dashboard")}
          />

          <Item
            icon={<Clock />}
            text="Attendance Management"
          />

          <Item
            icon={<Calendar />}
            text="Leave Management"
          />

          <Item
            icon={<DollarSign />}
            text="Salary Management"
          />

          <Item
            icon={<Settings />}
            text="Profile & Settings"
          />

        </nav>
      </div>

      <p className="text-sm text-gray-400">
        © 2026 WorkForce System
      </p>

    </div>
  );
}

function Item({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
        active
          ? "bg-blue-100 text-blue-700"
          : "hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
