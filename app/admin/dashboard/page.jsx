"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardPage() {

  const today = new Date().toISOString().split("T")[0];

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeaveToday: 0,
  });

  const [departments, setDepartments] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);

  /* ================= FETCH DASHBOARD DATA ================= */

  useEffect(() => {

    async function fetchDashboard() {

      /* ---- TOTAL EMPLOYEES ---- */
      const { count: totalEmployees } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("role", "Employee");

      /* ---- PRESENT TODAY ---- */
      const { count: presentToday } = await supabase
        .from("attendance")
        .select("employee_id", { count: "exact", head: true })
        .eq("date", today);

      /* ---- ON LEAVE TODAY ---- */
      const { count: onLeaveToday } = await supabase
        .from("leave_requests")
        .select("employee_id", { count: "exact", head: true })
        .eq("status", "Approved")
        .lte("start_date", today)
        .gte("end_date", today);

      const absentToday =
        totalEmployees - presentToday - onLeaveToday;

      setStats({
        totalEmployees,
        presentToday,
        absentToday: absentToday < 0 ? 0 : absentToday,
        onLeaveToday,
      });

      /* ---- DEPARTMENT WISE ---- */
      const { data: deptEmployees } = await supabase
        .from("employees")
        .select("employee_id, department")
        .eq("role", "Employee");

      const { data: deptAttendance } = await supabase
        .from("attendance")
        .select("employee_id")
        .eq("date", today);

      const presentSet = new Set(
        (deptAttendance || []).map(a => a.employee_id)
      );

      const deptMap = {};

      (deptEmployees || []).forEach(emp => {
        if (!deptMap[emp.department]) {
          deptMap[emp.department] = { total: 0, present: 0 };
        }
        deptMap[emp.department].total += 1;
        if (presentSet.has(emp.employee_id)) {
          deptMap[emp.department].present += 1;
        }
      });

      const deptResult = Object.keys(deptMap).map(name => {
        const d = deptMap[name];
        return {
          name,
          total: d.total,
          present: d.present,
          percent: Math.round((d.present / d.total) * 100),
        };
      });

      setDepartments(deptResult);

      /* ---- MONTHLY ATTENDANCE TREND ---- */
      const { data: monthlyData } = await supabase
        .from("attendance")
        .select("date");

      const monthMap = {};

      (monthlyData || []).forEach(a => {
        const month = new Date(a.date).toLocaleString("default", {
          month: "short",
        });
        monthMap[month] = (monthMap[month] || 0) + 1;
      });

      const monthResult = Object.keys(monthMap).map(m => ({
        month: m,
        value: Math.min(100, Math.round(monthMap[m] / totalEmployees * 100)),
      }));

      setMonthlyAttendance(monthResult);
    }

    fetchDashboard();

  }, [today]);

  /* ================= UI ================= */

  const statCardStyle = (bg) => ({
    background: bg,
    color: "#fff",
    padding: "24px",
    borderRadius: "16px",
  });

  return (
    <div style={{ display: "flex", background: "#f5f7fb" }}>

      <AdminSidebar />

      <div style={{ flex: 1, minHeight: "100vh" }}>

        <AdminHeader />

        <div style={{ padding: "24px" }}>

          <h2>Admin Dashboard</h2>
          <p style={{ color: "#6b7280" }}>
            Organization-level overview and insights
          </p>

          {/* STATS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "20px",
          }}>
            <div style={statCardStyle("#2563eb")}>
              <p>Total Employees</p>
              <h1>{stats.totalEmployees}</h1>
            </div>

            <div style={statCardStyle("#16a34a")}>
              <p>Present Today</p>
              <h1>{stats.presentToday}</h1>
            </div>

            <div style={statCardStyle("#dc2626")}>
              <p>Absent Today</p>
              <h1>{stats.absentToday}</h1>
            </div>

            <div style={statCardStyle("#9333ea")}>
              <p>On Leave Today</p>
              <h1>{stats.onLeaveToday}</h1>
            </div>
          </div>

          {/* DEPARTMENT + MONTH */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}>
            {/* Department */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "16px" }}>
              <h3>Department-wise Attendance</h3>

              {departments.map((d, i) => (
                <div key={i} style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{d.name}</span>
                    <span>{d.present}/{d.total} ({d.percent}%)</span>
                  </div>
                  <div style={{
                    height: "8px",
                    background: "#e5e7eb",
                    borderRadius: "8px",
                    marginTop: "6px",
                  }}>
                    <div style={{
                      width: `${d.percent}%`,
                      height: "100%",
                      background: "#2563eb",
                      borderRadius: "8px",
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "16px" }}>
              <h3>Monthly Attendance Trend</h3>

              <div style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
                height: "220px",
                marginTop: "20px",
              }}>
                {monthlyAttendance.map((m, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      height: `${m.value * 2}px`,
                      background: "#2563eb",
                      borderRadius: "8px",
                    }} />
                    <small>{m.month}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
