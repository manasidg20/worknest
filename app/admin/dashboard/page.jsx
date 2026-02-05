"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/AdminSidebar";
import Header from "@/app/components/Header";

export default function AdminDashboard() {

  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role !== "admin") {
      window.location.href = "/admin/login";
      return;
    }

    setAdminName(localStorage.getItem("employeeName") || "Admin");

  }, []);

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">

        <Header name={adminName} role="Admin" />

        <div className="p-8 space-y-8">

          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Organization-level overview and insights
            </p>
          </div>

          {/* TOP CARDS */}
          <div className="grid grid-cols-4 gap-6">

            <DashboardCard
              title="Total Employees"
              value="156"
              bg="bg-gradient-to-r from-blue-500 to-blue-600"
            />

            <DashboardCard
              title="Present Today"
              value="142"
              subtitle="91.0% attendance"
              bg="bg-green-500"
            />

            <DashboardCard
              title="Absent Today"
              value="8"
              subtitle="5.1% absent"
              bg="bg-red-500"
            />

            <DashboardCard
              title="On Leave Today"
              value="6"
              subtitle="Approved leaves"
              bg="bg-gradient-to-r from-purple-500 to-purple-600"
            />

          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-2 gap-6">

            {/* Department Attendance */}
            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="text-lg font-semibold mb-5">
                Department-wise Attendance
              </h2>

              <DepartmentBar
                name="Engineering"
                percent={90}
                color="bg-blue-500"
                label="45/50 (90%)"
              />

              <DepartmentBar
                name="Sales"
                percent={93}
                color="bg-green-500"
                label="28/30 (93%)"
              />

              <DepartmentBar
                name="Marketing"
                percent={88}
                color="bg-gray-300"
                label="22/25 (88%)"
              />

              <DepartmentBar
                name="HR"
                percent={90}
                color="bg-yellow-500"
                label="18/20 (90%)"
              />

              <DepartmentBar
                name="Finance"
                percent={94}
                color="bg-red-500"
                label="15/16 (94%)"
              />

            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="text-lg font-semibold mb-5">
                Monthly Attendance Trend
              </h2>

              <div className="flex items-end gap-4 h-52">

                {["Jan","Feb","Mar","Apr","May","Jun"].map((m,i)=>(
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-16 bg-blue-600 rounded-lg h-40"></div>
                    <p className="text-sm text-gray-500">{m}</p>
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-5">
              Recent Activity
            </h2>

            <ActivityItem
              text="New employee onboarded: Alex Thompson (EMP1156)"
              time="2 hours ago"
              dot="bg-green-500"
            />

            <ActivityItem
              text="Leave request approved for Sarah Williams"
              time="3 hours ago"
              dot="bg-blue-500"
            />

          </div>

        </div>
      </div>
    </div>
  );
}


/* ---------- CARD ---------- */

function DashboardCard({ title,value,subtitle,bg }) {
  return (
    <div className={`${bg} text-white rounded-xl p-6 shadow`}>

      <p className="text-sm opacity-90">{title}</p>

      <h2 className="text-4xl font-bold mt-2">{value}</h2>

      {subtitle && (
        <p className="text-sm opacity-80 mt-1">{subtitle}</p>
      )}

    </div>
  );
}


/* ---------- DEPARTMENT BAR ---------- */

function DepartmentBar({ name, percent, color, label }) {
  return (
    <div className="mb-5">

      <div className="flex justify-between text-sm mb-1">
        <p>{name}</p>
        <p className="text-gray-500">{label}</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          style={{ width:`${percent}%` }}
          className={`${color} h-2 rounded-full`}
        />
      </div>

    </div>
  );
}


/* ---------- ACTIVITY ---------- */

function ActivityItem({ text,time,dot }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 flex gap-3 items-start">

      <div className={`w-2 h-2 rounded-full mt-2 ${dot}`} />

      <div>
        <p>{text}</p>
        <p className="text-sm text-gray-400">{time}</p>
      </div>

    </div>
  );
}
