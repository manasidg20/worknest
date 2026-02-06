"use client";

export default function AdminHeader() {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* LEFT SECTION */}
      <div>
        <h3 style={{ margin: 0 }}>Welcome back, Admin</h3>
        <small style={{ color: "#6b7280" }}>
          Friday, February 6, 2026
        </small>
      </div>

      {/* RIGHT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px", color: "#374151" }}>
          Admin User
        </span>

        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#2563eb",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          A
        </div>
      </div>
    </div>
  );
}
