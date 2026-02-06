"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [adminId, setAdminId] = useState(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    role: "Admin",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  /* ================= ROUTE PROTECTION ================= */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("employeeId");

    if (isLoggedIn !== "true" || role !== "admin") {
      router.replace("/login");
      return;
    }

    setAdminId(id);
  }, [router]);

  /* ================= FETCH ADMIN PROFILE ================= */
  useEffect(() => {

    if (!adminId) return;

    async function fetchProfile() {

      const { data, error } = await supabase
        .from("admins")
        .select("name, email, phone, department")
        .eq("admin_id", adminId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProfile({
        fullName: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        department: data.department || "",
        role: "Admin",
      });
    }

    fetchProfile();

  }, [adminId]);

  /* ================= SAVE PROFILE ================= */
  async function saveProfile() {

    const { error } = await supabase
      .from("admins")
      .update({
        name: profile.fullName,
        phone: profile.phone,
        department: profile.department,
      })
      .eq("admin_id", adminId);

    if (error) {
      alert("Failed to update profile");
      return;
    }

    alert("Profile updated successfully");
    setIsEditing(false);
  }

  /* ================= UPDATE PASSWORD ================= */
  async function updatePassword() {

    if (
      !passwordData.current ||
      !passwordData.newPass ||
      !passwordData.confirm
    ) {
      alert("Fill all fields");
      return;
    }

    if (passwordData.newPass !== passwordData.confirm) {
      alert("Passwords do not match");
      return;
    }

    const { data } = await supabase
      .from("admins")
      .select("password")
      .eq("admin_id", adminId)
      .single();

    if (!data || data.password !== passwordData.current) {
      alert("Current password is incorrect");
      return;
    }

    const { error } = await supabase
      .from("admins")
      .update({ password: passwordData.newPass })
      .eq("admin_id", adminId);

    if (error) {
      alert("Failed to update password");
      return;
    }

    alert("Password updated successfully");

    setPasswordData({
      current: "",
      newPass: "",
      confirm: "",
    });
  }

  /* ================= LOGOUT ================= */
  function logout() {
    localStorage.clear();
    router.replace("/");
  }

  return (
    <div style={{ display: "flex", background: "#f5f7fb" }}>
      <AdminSidebar />

      <div style={{ flex: 1, minHeight: "100vh" }}>
        <AdminHeader />

        <div style={{ padding: "24px" }}>
          <h2>Profile & Settings</h2>
          <p style={{ color: "#6b7280" }}>
            Manage your account and preferences
          </p>

          {/* TABS */}
          <div style={tabsContainer}>
            {["Profile", "Settings"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...tabStyle,
                  background:
                    activeTab === tab ? "#eff6ff" : "transparent",
                  color: activeTab === tab ? "#2563eb" : "#374151",
                  fontWeight: activeTab === tab ? "600" : "500",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* PROFILE TAB */}
          {activeTab === "Profile" && (
            <div style={profileCard}>
              <div style={profileHeader}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={avatar}>👤</div>
                  <div>
                    <h3>{profile.fullName}</h3>
                    <small>{profile.role}</small>
                  </div>
                </div>

                <button style={editBtn} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div style={formGrid}>
                <Input
                  label="Full Name"
                  value={profile.fullName}
                  disabled={!isEditing}
                  onChange={(v) => setProfile({ ...profile, fullName: v })}
                />

                <Input label="Email Address" value={profile.email} disabled />

                <Input
                  label="Phone Number"
                  value={profile.phone}
                  disabled={!isEditing}
                  onChange={(v) => setProfile({ ...profile, phone: v })}
                />

                <Input
                  label="Department"
                  value={profile.department}
                  disabled={!isEditing}
                  onChange={(v) =>
                    setProfile({ ...profile, department: v })
                  }
                />

                <Input label="Role" value={profile.role} disabled />
              </div>

              {isEditing && (
                <div style={{ padding: "0 24px 24px" }}>
                  <button style={saveBtn} onClick={saveProfile}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "Settings" && (
            <div style={settingsBox}>
              <h3>Security Settings</h3>

              <Input
                label="Current Password"
                type="password"
                value={passwordData.current}
                onChange={(v) =>
                  setPasswordData({ ...passwordData, current: v })
                }
              />

              <Input
                label="New Password"
                type="password"
                value={passwordData.newPass}
                onChange={(v) =>
                  setPasswordData({ ...passwordData, newPass: v })
                }
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirm}
                onChange={(v) =>
                  setPasswordData({ ...passwordData, confirm: v })
                }
              />

              <button style={blueBtn} onClick={updatePassword}>
                Update Password
              </button>

              <hr style={{ margin: "32px 0" }} />

              <button style={logoutBtn} onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function Input({ label, value, disabled, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          background: disabled ? "#f9fafb" : "#fff",
        }}
      />
    </div>
  );
}

/* ================= STYLES ================= */

const tabsContainer = {
  background: "#fff",
  marginTop: "20px",
  borderRadius: "12px",
  display: "flex",
};

const tabStyle = {
  padding: "14px 24px",
  cursor: "pointer",
};

const profileCard = {
  background: "#fff",
  marginTop: "20px",
  borderRadius: "16px",
  overflow: "hidden",
};

const profileHeader = {
  background: "#2563eb",
  color: "#fff",
  padding: "24px",
  display: "flex",
  justifyContent: "space-between",
};

const avatar = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#fff",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const formGrid = {
  padding: "24px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const editBtn = {
  background: "#1d4ed8",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
};

const saveBtn = {
  background: "#16a34a",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
};

const settingsBox = {
  background: "#fff",
  marginTop: "20px",
  borderRadius: "16px",
  padding: "24px",
};

const blueBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
};

const logoutBtn = {
  background: "#dc2626",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
};
