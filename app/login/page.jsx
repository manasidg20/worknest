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

    if (!employeeId || !password) {
      alert("Fill all fields");
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .select("name, employee_id, password")
      .eq("employee_id", employeeId.trim())
      .limit(1);

    if (error) {
      console.error(error);
      alert("Database error");
      return;
    }

    if (!data || data.length === 0) {
      alert("Employee ID not found");
      return;
    }

    if (data[0].password !== password) {
      alert("Incorrect password");
      return;
    }

    // LOGIN SUCCESS
    localStorage.setItem("employeeName", data[0].name);
    localStorage.setItem("employeeId", data[0].employee_id);

    alert("Login Successful");
    router.push("/dashboard");
  }

  return (
    <div className="bg-office min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[380px] space-y-5">

        <Logo />

        <Input placeholder="Employee ID" onChange={(e) => setEmployeeId(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full bg-purple-600" onClick={handleLogin}>
          Login
        </Button>

      </div>
    </div>
  );
}
