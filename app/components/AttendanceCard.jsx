"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AttendanceCard({ employeeId }) {

  const [status, setStatus] = useState("not");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ⏱ Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔎 Fetch today's attendance
  useEffect(() => {
    async function fetchToday() {

      if (!employeeId) return;

      const { data, error } = await supabase
        .from("attendance")
        .select("check_in, check_out")
        .eq("employee_id", employeeId)
        .eq("date", today)
        .limit(1);

      if (error || !data || data.length === 0) return;

      if (data[0].check_in && !data[0].check_out) {
        setStatus("in");
      }

      if (data[0].check_out) {
        setStatus("out");
      }
    }

    fetchToday();
  }, [employeeId, today]);

  // 🟢 Punch In
  async function handlePunchIn() {

    setLoading(true);

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("attendance")
      .insert([
        {
          employee_id: employeeId,
          date: today,
          check_in: now
        }
      ]);

    if (error) {
      console.error("Punch In Error:", error);
      alert("Punch In Failed");
    } else {
      setStatus("in");
      alert("Punch In Successful");
    }

    setLoading(false);
  }

  // 🔴 Punch Out
  async function handlePunchOut() {

    setLoading(true);

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("attendance")
      .update({
        check_out: now
      })
      .eq("employee_id", employeeId)
      .eq("date", today);

    if (error) {
      console.error("Punch Out Error:", error);
      alert("Punch Out Failed");
    } else {
      setStatus("out");
      alert("Punch Out Successful");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-blue-600 text-white p-6 rounded-xl">
          <p>Current Date & Time</p>
          <h2 className="text-3xl font-bold">
            {currentTime.toLocaleTimeString()}
          </h2>
          <p>{currentTime.toDateString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Current Status</h3>
          <p>
            {status === "in"
              ? "Working"
              : status === "out"
              ? "Checked Out"
              : "Not Punched In"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Quick Info</h3>
          <p>Employee ID : {employeeId}</p>
          <p>Department : Engineering</p>
        </div>
      </div>

      {/* Action */}
      <div className="bg-white p-10 rounded-xl shadow flex flex-col items-center">

        <h2 className="text-xl font-semibold mb-5">
          Attendance Action
        </h2>

        {status === "not" && (
          <button
            disabled={loading}
            onClick={handlePunchIn}
            className="w-56 h-56 bg-green-500 rounded-full flex flex-col items-center justify-center text-white"
          >
            <CheckCircle size={40} />
            Punch In
          </button>
        )}

        {status === "in" && (
          <button
            disabled={loading}
            onClick={handlePunchOut}
            className="w-56 h-56 bg-red-500 rounded-full flex flex-col items-center justify-center text-white"
          >
            <XCircle size={40} />
            Punch Out
          </button>
        )}

        {status === "out" && (
          <div className="w-56 h-56 border rounded-full flex items-center justify-center text-gray-400">
            Day Complete
          </div>
        )}
      </div>
    </div>
  );
}
