"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "@/lib/supabaseClient";

export default function WeeklySummary() {

  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [weekData, setWeekData] = useState([]);

  // ⏱ Calculate hours from timestamps
  function calculateHours(checkIn, checkOut) {

    if (!checkIn || !checkOut) return 0;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    return (outDate - inDate) / (1000 * 60 * 60);
  }

  useEffect(() => {

    async function fetchWeeklyData() {

      const empId = localStorage.getItem("employeeId");
      const empName = localStorage.getItem("employeeName");

      if (!empId) return;

      setEmployeeId(empId);
      setName(empName || "");

      // 🔥 Fetch last 5 attendance records
      const { data, error } = await supabase
        .from("attendance")
        .select("date, check_in, check_out")
        .eq("employee_id", empId)
        .order("date", { ascending: false })
        .limit(5);

      if (error) {
        console.error(error);
        return;
      }

      setWeekData(data || []);
    }

    fetchWeeklyData();

  }, []);

  // 📊 Calculations
  const daysPresent = weekData.length;

  const totalHours = weekData.reduce((sum, r) => {
    return sum + calculateHours(r.check_in, r.check_out);
  }, 0);

  const average =
    daysPresent > 0 ? totalHours / daysPresent : 0;

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">

        <Header name={name} />

        <div className="p-8 space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">
              Weekly Summary
            </h1>
            <p className="text-gray-500">
              Your time analytics for this week
            </p>
          </div>

          {/* Current Week Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl flex justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Current Week
              </h2>
              <p>Last 5 Working Days</p>
            </div>

            <div>
              <p className="text-sm">Employee ID</p>
              <h2 className="text-xl font-bold">
                {employeeId}
              </h2>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-5">

            <StatCard
              title="Days Present"
              value={daysPresent}
            />

            <StatCard
              title="Total Hours Worked"
              value={totalHours.toFixed(1) + "h"}
            />

            <StatCard
              title="Average per Day"
              value={average.toFixed(1) + "h"}
            />

          </div>

          {/* Daily Breakdown */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Daily Hours Breakdown
            </h2>

            {weekData.length === 0 && (
              <p className="text-gray-500">
                No attendance data available
              </p>
            )}

            {weekData.map((r, index) => {

              const hours = calculateHours(
                r.check_in,
                r.check_out
              );

              return (
                <div key={index} className="mb-4">

                  <div className="flex justify-between mb-1">
                    <span>{r.date}</span>
                    <span>{hours.toFixed(1)}h</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{
                        width: `${Math.min((hours / 10) * 100, 100)}%`,
                      }}
                    />
                  </div>

                </div>
              );
            })}

          </div>

          {/* Weekly Progress */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-3">
              Weekly Progress
            </h2>

            <div className="w-full bg-gray-200 rounded-full h-4">

              <div
                className="bg-green-500 h-4 rounded-full"
                style={{
                  width: `${Math.min((totalHours / 45) * 100, 100)}%`,
                }}
              />

            </div>

            <p className="mt-2 text-sm text-gray-600">
              {totalHours.toFixed(1)}h / 45h Target
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Stat Card ---------- */

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>
      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}
