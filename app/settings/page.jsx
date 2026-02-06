"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Lock, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SettingsPage() {
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [employeeName, setEmployeeName] = useState("");

  /* PASSWORD STATE */
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  /* NOTIFICATION STATE */
  const [notifications, setNotifications] = useState({
    email: true,
    leave: true,
    attendance: false,
  });

  /* LOAD AUTH USER */
  useEffect(() => {
    async function loadUser() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth?.user) {
        router.push("/");
        return;
      }

      setUserId(auth.user.id);

      // fetch employee profile
      const { data } = await supabase
        .from("employees")
        .select("name")
        .eq("id", auth.user.id)
        .single();

      if (data) setEmployeeName(data.name);
    }

    loadUser();
  }, [router]);

  /* LOAD NOTIFICATIONS */
  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      const { data } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("employee_id", userId)
        .single();

      if (!data) {
        await supabase.from("notification_settings").insert({
          employee_id: userId,
        });
        return;
      }

      setNotifications({
        email: data.email,
        leave: data.leave,
        attendance: data.attendance,
      });
    }

    fetchNotifications();
  }, [userId]);

  /* PASSWORD INPUT */
  function handlePasswordChange(e) {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  }

  /* UPDATE PASSWORD (SUPABASE AUTH) */
  async function updatePassword() {
    if (!passwordData.newPass || !passwordData.confirm) {
      alert("Please fill all fields");
      return;
    }

    if (passwordData.newPass !== passwordData.confirm) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPass,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully");
    setPasswordData({ current: "", newPass: "", confirm: "" });
  }

  /* TOGGLE NOTIFICATIONS */
  async function toggleNotification(type) {
    const updated = { ...notifications, [type]: !notifications[type] };
    setNotifications(updated);

    await supabase
      .from("notification_settings")
      .update(updated)
      .eq("employee_id", userId);
  }

  /* LOGOUT */
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header name={employeeName} />

        <div className="p-8 space-y-8">
          <h1 className="text-3xl font-bold">Settings</h1>

          {/* PASSWORD */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-blue-600" />
              <h2 className="text-xl font-semibold">Change Password</h2>
            </div>

            <input
              type="password"
              name="newPass"
              placeholder="New password"
              value={passwordData.newPass}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg p-3 mb-3"
            />

            <input
              type="password"
              name="confirm"
              placeholder="Confirm new password"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg p-3 mb-3"
            />

            <button
              onClick={updatePassword}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Update Password
            </button>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-blue-600" />
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
            </div>

            <ToggleRow
              title="Email Notifications"
              description="Receive updates via email"
              checked={notifications.email}
              onClick={() => toggleNotification("email")}
            />

            <ToggleRow
              title="Leave Updates"
              description="Leave approval notifications"
              checked={notifications.leave}
              onClick={() => toggleNotification("leave")}
            />

            <ToggleRow
              title="Attendance Reminders"
              description="Daily reminders"
              checked={notifications.attendance}
              onClick={() => toggleNotification("attendance")}
            />
          </div>

          {/* LOGOUT */}
          <div className="bg-white rounded-xl shadow p-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 font-semibold"
            >
              <LogOut />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* TOGGLE */
function ToggleRow({ title, description, checked, onClick }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full flex items-center px-1 ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full ${
            checked ? "ml-auto" : ""
          }`}
        />
      </button>
    </div>
  );
}