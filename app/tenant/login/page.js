"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import tenantApiService from "@/API/TenantApiService"; // Adjust the path if needed

const TENANT_TOKEN_KEY = "tenant_token";

export default function TenantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await tenantApiService("POST", "login", {
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem(TENANT_TOKEN_KEY, response.access_token);
      console.log(
        "Token saved to localStorage: ",
        localStorage.getItem(TENANT_TOKEN_KEY)
      );
      console.log("Login successful:", response);
      // Redirect to tenant dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-background p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Tenant Login</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <label className="block mb-4">
          <span className="block text-gray-700 mb-1">Email</span>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-6">
          <span className="block text-gray-700 mb-1">Password</span>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </main>
  );
}
