"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Logo from "../components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Signup() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSignup() {

    if (!name || !email || !employeeId || !password || !confirm) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          employee_id: employeeId.trim(),
          password: password
        }
      ])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    console.log("Signup success:", data);

    alert("Signup Successful");
    router.push("/");
  }

  return (
    <div className="bg-office min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[380px] space-y-5">

        <Logo />

        <Input placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Employee ID" onChange={(e) => setEmployeeId(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <Input type="password" placeholder="Confirm Password" onChange={(e) => setConfirm(e.target.value)} />

        <Button className="w-full bg-purple-600" onClick={handleSignup}>
          Create Account
        </Button>

      </div>
    </div>
  );
}
