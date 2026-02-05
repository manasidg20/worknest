"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import LeaveModal from "../components/LeaveModal";
import { supabase } from "@/lib/supabaseClient";

export default function LeavePage() {

  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // ✅ REUSABLE FETCH FUNCTION
  async function fetchLeaves() {

    const empId = localStorage.getItem("employeeId");
    const empName = localStorage.getItem("employeeName");

    if (!empId) return;

    setEmployeeId(empId);
    setName(empName || "");

    const { data, error } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("employee_id", empId)
      .order("applied_on", { ascending: false });

    if (error) {
      console.error("Fetch leave error:", error);
      return;
    }

    setLeaveData(data || []);
  }

  // ✅ FETCH ON PAGE LOAD
  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ---------- Leave Balance Calculation ---------- */

  const balances = {
    Annual: { total: 20, used: 0 },
    Sick: { total: 10, used: 0 },
    Casual: { total: 5, used: 0 }
  };

  leaveData.forEach((l) => {
    if (balances[l.type]) {
      balances[l.type].used += l.days;
    }
  });

  /* ---------- UI ---------- */

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">

        <Header name={name} />

        <div className="p-8 space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">
              Leave Management
            </h1>
            <p className="text-gray-500">
              Manage your leave requests and view balance
            </p>
          </div>

          {/* Request Leave Button */}
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            Request Leave
          </button>

          {/* Leave Balance Cards */}
          <div className="grid grid-cols-3 gap-5">

            {Object.keys(balances).map((type) => {

              const data = balances[type];

              return (
                <div
                  key={type}
                  className="bg-white p-6 rounded-xl shadow"
                >
                  <h3 className="font-semibold text-lg mb-3">
                    {type} Leave
                  </h3>

                  <p>
                    Allocated :
                    <span className="font-semibold ml-2">
                      {data.total}
                    </span>
                  </p>

                  <p>
                    Used :
                    <span className="text-red-500 ml-2">
                      {data.used}
                    </span>
                  </p>

                  <p>
                    Remaining :
                    <span className="text-green-600 ml-2">
                      {data.total - data.used}
                    </span>
                  </p>
                </div>
              );
            })}

          </div>

          {/* Leave Requests Table */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Leave Requests
            </h2>

            <table className="w-full">

              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Applied On</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>

                {leaveData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-5 text-gray-400">
                      No Leave Requests Yet
                    </td>
                  </tr>
                )}

                {leaveData.map((l) => (

                  <tr key={l.id} className="border-b">

                    <td className="p-3">{l.type}</td>

                    <td className="p-3">
                      {l.start_date} - {l.end_date}
                      <br />
                      <span className="text-sm text-gray-500">
                        {l.days} days
                      </span>
                    </td>

                    <td className="p-3">{l.reason}</td>

                    <td className="p-3">
                      {new Date(l.applied_on).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          l.status === "Approved"
                            ? "bg-green-200 text-green-700"
                            : l.status === "Rejected"
                            ? "bg-red-200 text-red-700"
                            : "bg-yellow-200 text-yellow-700"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Leave Calendar Placeholder */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">
              Leave Calendar
            </h2>
            <p className="text-gray-400 mt-2">
              Calendar UI can be added later
            </p>
          </div>

        </div>
      </div>

      {/* ✅ PASS CALLBACK TO MODAL */}
      {showModal && (
        <LeaveModal
          closeModal={() => setShowModal(false)}
          onSuccess={fetchLeaves}
        />
      )}

    </div>
  );
}
