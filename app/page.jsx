"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Logo from "./components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {

  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {

    const empId = employeeId.trim();
    const pwd = password.trim();

    if (!empId || !pwd) {
      alert("Fill all fields");
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .select("name, employee_id, password")
      .eq("employee_id", empId);

    if (error || !data || data.length === 0) {
      alert("Invalid Employee ID or Password");
      return;
    }

    if (data[0].password !== pwd) {
      alert("Invalid Employee ID or Password");
      return;
    }

    localStorage.setItem("employeeName", data[0].name);
    localStorage.setItem("employeeId", data[0].employee_id);

    router.push("/dashboard");
  }

  return (
    <div className="bg-office min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[380px] space-y-5">

        <Logo />

        <Input
          placeholder="Employee ID"
          onChange={(e) => setEmployeeId(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="w-full bg-purple-600"
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* 👇 SIGNUP LINK */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer font-semibold"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}
