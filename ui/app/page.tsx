"use client";

export default function Home() {
  async function openChrome() {
    try {
      const response = await fetch("http://127.0.0.1:8000/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "open",
          target: "chrome",
        }),
      });

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      alert("Cannot connect to backend.");
      console.error(error);
    }
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0a0a0a",
        color: "white",
        gap: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "48px" }}>VAANI</h1>

      <p>Your Personal AI Assistant</p>

      <button
        onClick={openChrome}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        Open Chrome
      </button>
    </main>
  );
}