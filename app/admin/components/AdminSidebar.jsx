"use client";

import { useRouter, usePathname } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Attendance Management",
      path: "/admin/attendancemanagement",
    },
    {
      name: "Leave Management",
      path: "/admin/leavemanagement",
    },
    {
      name: "Salary Management",
      path: "/admin/salarymanagement",
    },
    {
      name: "Profile & Settings",
      path: "/admin/profile",
    },
  ];

  return (
    <div
      style={{
        width: "260px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 16px",
        height: "100vh",
      }}
    >
      {/* LOGO */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ color: "#2563eb", marginBottom: "4px" }}>
          WorkForce
        </h2>
        <small style={{ color: "#6b7280" }}>
          Attendance System
        </small>
      </div>

      {/* MENU */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li
              key={item.name}
              onClick={() => router.push(item.path)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                background: isActive ? "#e0e7ff" : "transparent",
                color: isActive ? "#1d4ed8" : "#374151",
                fontWeight: isActive ? "600" : "500",
                transition: "0.2s",
              }}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
