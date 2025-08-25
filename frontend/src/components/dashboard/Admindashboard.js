import React from "react";
import { useNavigate } from "react-router-dom";
import katalystLogo from "../../assets/katalyst-Logo.jpg";

function Admindashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: "translateY(-40px)",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f9f9f9, #ffe6f0, #fff5e6)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Logo */}
      <img
        src={katalystLogo}
        alt="Katalyst Logo"
        style={{ width: "180px", marginBottom: "1.5rem" }}
      />

      {/* Title */}
      <h1 style={{ fontSize: "2rem", color: "#333", marginBottom: "2rem" }}>
        Admin Dashboard
      </h1>

      {/* Button Section */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Create Events */}
        <button
          style={{
            padding: "1rem 2.5rem",
            fontSize: "1rem",
            background: "#e20a6a",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          onClick={() => navigate("/create-event")}
        >
          🎉 Create Events
        </button>

        {/* View Analytics */}
        <button
          style={{
            padding: "1rem 2.5rem",
            fontSize: "1rem",
            background: "#f28c1b",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          📊 View Analytics
        </button>

        {/* All Events */}
        <button
          style={{
            padding: "1rem 2.5rem",
            fontSize: "1rem",
            background: "#d51a2b",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          onClick={() => navigate("/events-showcase")}
        >
          📅 All Events
        </button>
      </div>
    </div>
  );
}

export default Admindashboard;
