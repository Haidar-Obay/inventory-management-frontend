"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [tenant, setTenant] = useState("");

  const goToCentral = () => {
    router.push("/central");
  };

  const goToTenant = () => {
    if (tenant.trim() !== "") {
      window.location.href = `http://${tenant}.app.localhost:3000/${tenant}`; 
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        marginTop: "5rem",
      }}
    >


      <button onClick={goToCentral} style={buttonStyle}>
        Enter Central System
      </button>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Enter tenant name"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          style={inputStyle}
        />
        <button onClick={goToTenant} style={buttonStyle}>
          Go to Tenant
        </button>
      </div>
    </main>
  );
}

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#333",
  color: "#fff",
  cursor: "pointer",
};

const inputStyle = {
  padding: "0.6rem 1rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
