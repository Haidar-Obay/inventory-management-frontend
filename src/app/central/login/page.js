"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CentralApiService from "@/API/CentralApiService";
import { Loader2, ExternalLink, ChevronRight } from "lucide-react";
import { Button, Input } from "xd-ui-kit";

export default function CentralLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await CentralApiService("post", "login", {
        email,
        password,
      });

      console.log("Login Response:", data);

      localStorage.setItem("central_token", data.access_token);
      setToken(data.token);

      router.push("/central/");
    } catch (err) {
      setError("Login failed: " + err.message);
      console.error("Login Error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Central Login</h1>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {token && <p style={{ color: "green" }}>✅ Token saved!</p>}
      </form>
      
      <Button
      rightIcon={<ChevronRight className="transition-transform group-hover:translate-x-1" />}
      className="group"
      loading={true}
      loadingText="Loading"
      // fullWidth={true}
      rounded={true}
      sizeStyles="lg"
    >
      children
    </Button>

      <Input placeholder="XD input" className="transition-all duration-200 " />
    </div>
  );
}
