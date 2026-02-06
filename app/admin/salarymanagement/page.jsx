"use client";

import { useEffect, useRef, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";

export default function SalaryManagementPage() {

  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const printRef = useRef();

  /* ================= FETCH SALARIES ================= */
  async function fetchSalaries() {

    const { data, error } = await supabase
      .from("salaries")
      .select(`
        id,
        employee_id,
        month,
        basic,
        allowances,
        deductions,
        status,
        employees ( name )
      `)
      .order("created_at", { ascending: false });

    if (!error) setSalaryRecords(data || []);
  }

  useEffect(() => {
    fetchSalaries();
  }, []);

  /* ================= SUMMARY ================= */
  const totalSalaries = salaryRecords.reduce(
    (sum, r) => sum + (r.basic + r.allowances - r.deductions),
    0
  );

  const paidCount = salaryRecords.filter((r) => r.status === "Paid").length;
  const pendingCount = salaryRecords.filter((r) => r.status === "Pending").length;

  /* ================= PRINT ================= */
  function handleDownload() {
    const content = printRef.current.innerHTML;
    const original = document.body.innerHTML;

    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  }

  return (
    <div style={{ display: "flex", background: "#f5f7fb" }}>

      <AdminSidebar />

      <div style={{ flex: 1, minHeight: "100vh" }}>
        <AdminHeader />

        <div style={{ padding: "24px" }}>

          <h2>Salary Management</h2>
          <p style={{ color: "#6b7280" }}>
            Manage employee salary and generate slips
          </p>

          {/* SUMMARY */}
          <div style={summaryGrid}>
            <div style={summaryCard("#eff6ff", "#2563eb")}>
              <p>Total Salaries</p>
              <h2>${totalSalaries.toLocaleString()}</h2>
            </div>

            <div style={summaryCard("#f0fdf4", "#16a34a")}>
              <p>Paid</p>
              <h2>{paidCount}</h2>
            </div>

            <div style={summaryCard("#fefce8", "#ca8a04")}>
              <p>Pending</p>
              <h2>{pendingCount}</h2>
            </div>
          </div>

          {/* TABLE */}
          <div style={cardBox}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Salary Records</h3>
              <span>{salaryRecords.length} records</span>
            </div>

            <table style={{ width: "100%", marginTop: "12px" }}>
              <thead>
                <tr style={thead}>
                  <th>EMPLOYEE</th>
                  <th>MONTH</th>
                  <th>BASIC</th>
                  <th>ALLOWANCES</th>
                  <th>DEDUCTIONS</th>
                  <th>NET SALARY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {salaryRecords.map((r) => {

                  const net = r.basic + r.allowances - r.deductions;

                  return (
                    <tr key={r.id} style={row}>
                      <td>
                        <strong>{r.employees?.name}</strong>
                        <br />
                        <small>{r.employee_id}</small>
                      </td>
                      <td>{r.month}</td>
                      <td>${r.basic}</td>
                      <td style={{ color: "green" }}>+${r.allowances}</td>
                      <td style={{ color: "red" }}>-${r.deductions}</td>
                      <td><strong>${net}</strong></td>
                      <td>
                        <span style={statusBadge(r.status)}>{r.status}</span>
                      </td>
                      <td>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedSlip(r)}
                        >
                          👁
                        </span>
                        <span
                          style={{ marginLeft: "12px", cursor: "pointer" }}
                          onClick={() => {
                            setSelectedSlip(r);
                            setTimeout(handleDownload, 300);
                          }}
                        >
                          ⬇
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SALARY SLIP */}
      {selectedSlip && (
        <div style={overlay}>
          <div style={modal}>
            <button style={closeBtn} onClick={() => setSelectedSlip(null)}>✕</button>

            <div ref={printRef}>
              <h2 style={{ textAlign: "center" }}>Salary Slip</h2>
              <hr />

              <p><b>Name:</b> {selectedSlip.employees?.name}</p>
              <p><b>Employee ID:</b> {selectedSlip.employee_id}</p>
              <p><b>Month:</b> {selectedSlip.month}</p>
              <p><b>Status:</b> {selectedSlip.status}</p>

              <hr />

              <p>Basic: ${selectedSlip.basic}</p>
              <p>Allowances: +${selectedSlip.allowances}</p>
              <p>Deductions: -${selectedSlip.deductions}</p>

              <h3>
                Net Salary: $
                {selectedSlip.basic +
                  selectedSlip.allowances -
                  selectedSlip.deductions}
              </h3>
            </div>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button style={grayBtn} onClick={() => setSelectedSlip(null)}>
                Close
              </button>
              <button style={blueBtn} onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ===== STYLES (UNCHANGED) ===== */

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginTop: "20px",
};

const summaryCard = (bg, color) => ({
  background: bg,
  borderRadius: "16px",
  padding: "20px",
  color,
});

const cardBox = {
  background: "#fff",
  marginTop: "24px",
  borderRadius: "16px",
  padding: "16px",
};

const thead = {
  textAlign: "left",
  color: "#6b7280",
  borderBottom: "1px solid #e5e7eb",
};

const row = {
  borderBottom: "1px solid #e5e7eb",
};

const statusBadge = (status) => ({
  padding: "4px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  background: status === "Paid" ? "#dcfce7" : "#fef3c7",
  color: status === "Paid" ? "#166534" : "#92400e",
});

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 50,
};

const modal = {
  background: "#fff",
  width: "720px",
  borderRadius: "16px",
  padding: "24px",
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "14px",
  right: "16px",
  background: "transparent",
  border: "none",
  fontSize: "18px",
};

const blueBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  marginLeft: "10px",
};

const grayBtn = {
  background: "#e5e7eb",
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
};
