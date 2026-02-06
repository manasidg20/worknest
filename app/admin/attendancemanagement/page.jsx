"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";

export default function AttendanceManagementPage() {

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
  });

  /* ================= FETCH EMPLOYEES ================= */
  async function fetchEmployees() {
    const { data } = await supabase
      .from("employees")
      .select("employee_id, name, department")
      .eq("role", "Employee");

    setEmployees(data || []);
  }

  /* ================= FETCH ATTENDANCE ================= */
  async function fetchAttendance() {

    const { data, error } = await supabase
      .from("attendance")
      .select(`
        employee_id,
        date,
        check_in,
        check_out,
        employees ( name, department )
      `)
      .order("date", { ascending: false });

    if (!error) setRecords(data || []);
  }

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  /* ================= ADD MANUAL ENTRY ================= */
  async function handleAddRecord() {

    if (!formData.employee_id || !formData.date) {
      alert("Employee and Date are required");
      return;
    }

    const payload = {
      employee_id: formData.employee_id,
      date: formData.date,
      check_in: formData.check_in
        ? `${formData.date}T${formData.check_in}`
        : null,
      check_out: formData.check_out
        ? `${formData.date}T${formData.check_out}`
        : null,
    };

    const { error } = await supabase
      .from("attendance")
      .insert([payload]);

    if (error) {
      alert("Failed to add attendance");
      return;
    }

    setShowModal(false);
    setFormData({
      employee_id: "",
      date: "",
      check_in: "",
      check_out: "",
    });

    fetchAttendance();
  }

  return (
    <div style={{ display: "flex", background: "#f5f7fb" }}>

      <AdminSidebar />

      <div style={{ flex: 1, minHeight: "100vh" }}>
        <AdminHeader />

        <div style={{ padding: "24px" }}>

          <h2>Attendance Management</h2>
          <p style={{ color: "#6b7280" }}>
            Full control over organization attendance records
          </p>

          {/* ACTION BAR */}
          <div style={cardBox}>
            <button style={blueBtn} onClick={() => setShowModal(true)}>
              + Add Manual Entry
            </button>
          </div>

          {/* TABLE */}
          <div style={{ ...cardBox, marginTop: "24px", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Attendance Records</h3>
              <span>{records.length} records</span>
            </div>

            <table style={{ width: "100%", marginTop: "12px" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>DATE</th>
                  <th>CHECK-IN</th>
                  <th>CHECK-OUT</th>
                </tr>
              </thead>

              <tbody>
                {records.map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td>{r.employees?.name} ({r.employee_id})</td>
                    <td>{r.employees?.department}</td>
                    <td>{r.date}</td>
                    <td>{r.check_in ? new Date(r.check_in).toLocaleTimeString() : "--"}</td>
                    <td>{r.check_out ? new Date(r.check_out).toLocaleTimeString() : "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Add Manual Attendance</h3>

            <div style={grid}>
              <select
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                style={input}
              >
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {e.name} ({e.employee_id})
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                style={input}
              />

              <input
                type="time"
                value={formData.check_in}
                onChange={(e) =>
                  setFormData({ ...formData, check_in: e.target.value })
                }
                style={input}
              />

              <input
                type="time"
                value={formData.check_out}
                onChange={(e) =>
                  setFormData({ ...formData, check_out: e.target.value })
                }
                style={input}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button style={grayBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button style={blueBtn} onClick={handleAddRecord}>
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const cardBox = {
  background: "#fff",
  padding: "16px",
  borderRadius: "16px",
  display: "flex",
  gap: "12px",
};

const blueBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const grayBtn = {
  background: "#e5e7eb",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "520px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "16px",
};

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
};
