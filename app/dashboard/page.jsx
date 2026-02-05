"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AttendanceCard from "../components/AttendanceCard";

export default function Dashboard() {

  const [employeeName, setEmployeeName] = useState("Employee");
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {

    const name = localStorage.getItem("employeeName");
    const id = localStorage.getItem("employeeId");

    if (name) setEmployeeName(name);
    if (id) setEmployeeId(id);

  }, []);

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">

        {/* PASS NAME TO HEADER */}
        <Header name={employeeName} />

        <div className="p-8">

          <h1 className="text-2xl font-bold mb-6">
            Employee Dashboard
          </h1>

          <AttendanceCard employeeId={employeeId} />

        </div>

      </div>
    </div>
  );
}
