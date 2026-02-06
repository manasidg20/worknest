"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/app/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {

  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");

    if (isLoggedIn === "true" && role === "admin") {
      router.replace("/admin/dashboard");
    }

    if (isLoggedIn === "true" && role === "employee") {
      router.replace("/dashboard");
    }

  }, [router]);

  /* ================= ADMIN LOGIN ================= */
  async function handleAdminLogin() {

    if (!adminId || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("admin_id", adminId)
      .eq("password", password)
      .single();

    if (error || !data) {
      alert("Invalid Admin Credentials");
      setLoading(false);
      return;
    }

    // Save session
    localStorage.clear();
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "admin");
    localStorage.setItem("employeeName", data.name);
    localStorage.setItem("employeeId", data.admin_id);

    router.replace("/admin/dashboard");
  }

  return (
    <div className="bg-office min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[380px] space-y-5">

        {/* LOGO */}
        <Logo />

        {/* TITLE */}
        <h2 className="text-center text-lg font-semibold text-gray-800">
          Admin Login
        </h2>

        {/* INPUTS */}
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

        {/* LOGIN BUTTON */}
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={handleAdminLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* BACK TO EMPLOYEE LOGIN */}
        <p className="text-center text-sm text-gray-600">
          Are you an employee?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-purple-600 cursor-pointer font-semibold"
          >
            Login here
          </span>
        </p>

      </div>
    </div>
  );
}

//Admin ID: ADMIN001
//Password: admin123
