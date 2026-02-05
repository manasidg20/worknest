"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "@/lib/supabaseClient";

export default function AttendancePage() {

  const [records, setRecords] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {

    async function fetchAttendance() {

      const employeeId = localStorage.getItem("employeeId");
      const employeeName = localStorage.getItem("employeeName");

      console.log("Employee ID:", employeeId);

      if (!employeeId) return;

      setName(employeeName || "");

      const { data, error } = await supabase
        .from("attendance")
        .select("date, check_in, check_out")
        .eq("employee_id", employeeId.trim())
        .order("date", { ascending: false });

      console.log("Fetched Attendance:", data, error);

      if (error) return;

      setRecords(data || []);
    }

    fetchAttendance();

  }, []);

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">

        <Header name={name} />

        <div className="p-8">

          <h1 className="text-2xl font-bold mb-6">
            Attendance History
          </h1>

          <table className="w-full bg-white shadow rounded-lg">

            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
              </tr>
            </thead>

            <tbody>

              {records.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}

              {records.map((r, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.check_in || "--"}</td>
                  <td className="p-3">{r.check_out || "--"}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}
