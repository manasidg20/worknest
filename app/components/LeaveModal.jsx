"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LeaveModal({ closeModal, onSuccess }) {

  const [type, setType] = useState("Annual");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  function calculateDays(startDate, endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }

  async function submitLeave() {

    const employeeId = localStorage.getItem("employeeId");

    if (!employeeId || !start || !end || !reason) {
      alert("Fill all fields");
      return;
    }

    const days = calculateDays(start, end);

    setLoading(true);

    const payload = {
      employee_id: employeeId,
      type: type,
      start_date: start,
      end_date: end,
      days: days,
      reason: reason,
      status: "Pending"
    };

    console.log("INSERT PAYLOAD:", payload);

    const { data, error } = await supabase
      .from("leave_requests")
      .insert([payload])
      .select();

    console.log("INSERT RESULT:", data, error);

    if (error) {
      alert("Insert failed — check console");
      setLoading(false);
      return;
    }

    alert("Leave request submitted");

    onSuccess();      // refresh table
    closeModal();     // close modal
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white w-[420px] rounded-xl p-6 space-y-4">

        <h2 className="text-xl font-semibold">Request Leave</h2>

        <select
          className="w-full border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Annual</option>
          <option>Sick</option>
          <option>Casual</option>
        </select>

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={submitLeave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}
