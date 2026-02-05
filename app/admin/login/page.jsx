"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/app/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {

  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const ADMIN_ID = "ADMIN001";
  const ADMIN_PASSWORD = "admin123";

  /* ⭐ Auto Redirect If Already Logged In */
  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role === "admin") router.push("/admin/dashboard");
    if (role === "employee") router.push("/dashboard");

  }, []);

  function handleAdminLogin() {

    if (!adminId || !password) {
      alert("Please enter credentials");
      return;
    }

    if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {

      /* CLEAR OLD SESSION */
      localStorage.clear();

      localStorage.setItem("employeeName", "Admin User");
      localStorage.setItem("employeeId", ADMIN_ID);
      localStorage.setItem("role", "admin");

      router.push("/admin/dashboard");
      return;
    }

    alert("Invalid Admin Credentials");
  }

  return (
    <div className="bg-office min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[380px] space-y-5">

        <Logo />

        <h2 className="text-xl font-semibold text-center">
          Admin Login
        </h2>

        <Input
          placeholder="Admin ID"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-700">
          <p className="font-semibold">Demo Admin Credentials</p>
          <p>ID: <b>{ADMIN_ID}</b></p>
          <p>Password: <b>{ADMIN_PASSWORD}</b></p>
        </div>

        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={handleAdminLogin}
        >
          Login as Admin
        </Button>

        {/* 🔗 BACK TO EMPLOYEE LOGIN */}
        <p className="text-center text-sm text-gray-500">
          Employee Login?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Click Here
          </span>
        </p>

      </div>
    </div>
  );
}
