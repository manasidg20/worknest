"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";

export default function LeaveManagementPage() {

  const [activeTab, setActiveTab] = useState("All");
  const [leaveRecords, setLeaveRecords] = useState([]);

  /* ================= FETCH LEAVES ================= */
  async function fetchLeaves() {

    const { data, error } = await supabase
      .from("leave_requests")
      .select(`
        id,
        employee_id,
        type,
        start_date,
        end_date,
        days,
        reason,
        status,
        applied_on,
        employees ( name )
      `)
      .order("applied_on", { ascending: false });

    if (!error) setLeaveRecords(data || []);
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= UPDATE STATUS ================= */
  async function updateStatus(id, status) {

    const { error } = await supabase
      .from("leave_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Failed to update status");
      return;
    }

    fetchLeaves();
  }

  /* ================= FILTER LOGIC ================= */
  const filteredRecords =
    activeTab === "All"
      ? leaveRecords
      : leaveRecords.filter((r) => r.status === activeTab);

  const countByStatus = (status) =>
    leaveRecords.filter((r) => r.status === status).length;

  return (
    <div style={{ display: "flex", background: "#f5f7fb" }}>

      <AdminSidebar />

      <div style={{ flex: 1, minHeight: "100vh" }}>
        <AdminHeader />

        <div style={{ padding: "24px" }}>

          <h2>Leave Management</h2>
          <p style={{ color: "#6b7280" }}>
            Full control over organization leave requests
          </p>

          {/* TABS */}
          <div style={tabsContainer}>
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...tabStyle,
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #2563eb"
                      : "3px solid transparent",
                  color: activeTab === tab ? "#2563eb" : "#374151",
                  fontWeight: activeTab === tab ? "600" : "500",
                }}
              >
                {tab}
                <span style={badge}>
                  {tab === "All"
                    ? leaveRecords.length
                    : countByStatus(tab)}
                </span>
              </div>
            ))}
          </div>

          {/* TABLE */}
          <div style={cardBox}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={thead}>
                  <th>EMPLOYEE</th>
                  <th>LEAVE TYPE</th>
                  <th>DURATION</th>
                  <th>REASON</th>
                  <th>APPLIED ON</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r.id} style={row}>
                    <td>
                      <strong>{r.employees?.name}</strong>
                      <br />
                      <small>{r.employee_id}</small>
                    </td>

                    <td>{r.type}</td>

                    <td>
                      {r.start_date} – {r.end_date}
                      <br />
                      <small>{r.days} days</small>
                    </td>

                    <td>{r.reason}</td>

                    <td>
                      {new Date(r.applied_on).toLocaleDateString()}
                    </td>

                    <td>
                      <span style={statusBadge(r.status)}>
                        {r.status}
                      </span>
                    </td>

                    <td style={{ fontSize: "18px" }}>
                      {r.status === "Pending" && (
                        <>
                          <span
                            style={{ cursor: "pointer", marginRight: "10px" }}
                            onClick={() => updateStatus(r.id, "Approved")}
                          >
                            ✔
                          </span>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => updateStatus(r.id, "Rejected")}
                          >
                            ❌
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const tabsContainer = {
  background: "#fff",
  marginTop: "20px",
  borderRadius: "12px",
  display: "flex",
};

const tabStyle = {
  padding: "14px 24px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const badge = {
  background: "#e5e7eb",
  borderRadius: "999px",
  padding: "2px 8px",
  fontSize: "12px",
};

const cardBox = {
  background: "#fff",
  marginTop: "16px",
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
  background:
    status === "Pending"
      ? "#fef3c7"
      : status === "Approved"
      ? "#dcfce7"
      : "#fee2e2",
  color:
    status === "Pending"
      ? "#92400e"
      : status === "Approved"
      ? "#166534"
      : "#991b1b",
});
