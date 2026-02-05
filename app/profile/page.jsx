"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Pencil, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {

  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  /* 🔄 Load profile from Supabase */
  useEffect(() => {

    async function fetchProfile() {

      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) return;

      const { data, error } = await supabase
        .from("employees")
        .select(
          "name, email, employee_id, role, phone, department"
        )
        .eq("employee_id", employeeId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const profile = {
        name: data.name,
        email: data.email,
        employeeId: data.employee_id,
        role: data.role || "Employee",
        phone: data.phone || "",
        department: data.department || ""
      };

      setUser(profile);
      setFormData(profile);

      // keep header name in sync
      localStorage.setItem("employeeName", data.name);
    }

    fetchProfile();

  }, []);

  /* Handle Input Change */
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  /* 💾 SAVE CHANGES TO SUPABASE */
  async function handleSave() {

    const { error } = await supabase
      .from("employees")
      .update({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department
      })
      .eq("employee_id", formData.employeeId);

    if (error) {
      alert("Failed to save profile");
      console.error(error);
      return;
    }

    // sync local state + localStorage
    setUser(formData);
    localStorage.setItem("employeeName", formData.name);

    alert("Profile updated successfully");
    setEditMode(false);
  }

  /* ❌ CANCEL */
  function handleCancel() {
    setFormData(user);
    setEditMode(false);
  }

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">

        <Header name={formData.name} />

        <div className="p-10 space-y-8 max-w-5xl mx-auto">

          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Profile
            </h1>
            <p className="text-gray-500">
              Manage your personal information
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 flex items-center gap-6 text-white">

              <div className="w-28 h-28 rounded-full border-4 border-white shadow flex items-center justify-center text-5xl bg-white text-gray-700">
                👨
              </div>

              <div>
                <h2 className="text-3xl font-semibold">
                  {formData.name}
                </h2>
                <p className="opacity-90">{formData.role}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-10">

              {/* Header Row */}
              <div className="flex justify-between items-center mb-8">

                <h3 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h3>

                {!editMode ? (

                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>

                ) : (

                  <div className="flex gap-3">

                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-2.5 border rounded-lg"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>

                  </div>
                )}
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-2 gap-8">

                <EditableField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  editMode={editMode}
                />

                <EditableField
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  editMode={editMode}
                />

                <EditableField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  editMode={editMode}
                />

                <EditableField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  editMode={editMode}
                />

                <EditableField
                  label="Employee ID"
                  value={formData.employeeId}
                  disabled
                />

                <EditableField
                  label="Role"
                  value={formData.role}
                  disabled
                />

              </div>

              {editMode && (
                <div className="mt-8 p-4 bg-blue-50 border rounded-xl text-blue-700 text-sm">
                  <b>Note:</b> Employee ID and Role cannot be edited.
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Editable Field ---------- */

function EditableField({
  label,
  name,
  value,
  onChange,
  editMode,
  disabled
}) {
  return (
    <div className="space-y-2">

      <p className="text-sm font-medium text-gray-600">
        {label}
      </p>

      {editMode && !disabled ? (

        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full border rounded-lg p-3"
        />

      ) : (

        <div className="bg-gray-50 border rounded-lg p-3 text-gray-700">
          {value}
        </div>

      )}

    </div>
  );
}
