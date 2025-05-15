"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import CentralApiService from "@/API/CentralApiService";

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [userIdDelete, setUserIdDelete] = useState("");
  const [input, setInput] = useState("");

  const handleDelete = () => {
    const ids = input.split(",").map((id) => parseInt(id.trim(), 10));
    CentralApiService("delete", "bulk-delete-users", { ids })
      .then((res) => console.log("Success:", res))
      .catch((err) => console.error("Error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("central_token");
    router.push("/central/");
    console.log("Logged out successfully");
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await CentralApiService("post", "register", form);
      console.log("Registered:", res);
      setSuccess("✅ Admin registered successfully!");
      // Optionally redirect:
      // router.push("/login");
    } catch (err) {
      setError(err.message || "❌ Registration failed");
      console.error("Register Error:", err);
    }
  };

  const [tenantId, setTenantId] = useState("");
  const [formTenant, setFormTenant] = useState({
    name: "",
    email: "",
    domain: "",
    password: "",
  });

  const [errorTenant, setErrorTenant] = useState("");
  const [successTenant, setSuccessTenant] = useState("");

  const handleChangeTenant = (e) => {
    setFormTenant({ ...formTenant, [e.target.name]: e.target.value });
  };

  const handleSubmitTenant = async (e) => {
    e.preventDefault();
    setErrorTenant("");
    setSuccessTenant("");

    try {
      const res = await CentralApiService("post", "tenant", formTenant);
      console.log("Tenant created:", res);
      setSuccessTenant("✅ Tenant created successfully!");
    } catch (err) {
      console.error("Tenant creation error:", err);
      setErrorTenant(err.message || "❌ Failed to create tenant.");
    }
  };

  const [deleteTenantDomain, setDeleteTenantDomain] = useState("");
  const [message, setMessage] = useState("");
  const handleTenantDelete = async () => {
    if (!deleteTenantDomain) {
      setMessage("❌ Please enter a tenant domain to delete.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete tenant "${deleteTenantDomain}"?`
    );
    if (!confirmed) return;

    setMessage("");

    try {
      const res = await CentralApiService(
        "delete",
        `tenant/${deleteTenantDomain}`
      );
      console.log("Tenant deleted:", res);
      setMessage("🗑️ Tenant deleted successfully.");
    } catch (err) {
      console.error("Tenant delete error:", err);
      setMessage("❌ Failed to delete tenant.");
    }
  };

  return (
    <div className="">
      <div>
        <h1>Authentication</h1>

        <button
          onClick={() => {
            router.push("/central/login");
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
        <br />
        <br />

        <button
          onClick={() => {
            CentralApiService("get", "get-all-users").then((data) =>
              console.log(data)
            );
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          get all users
        </button>
        <br />
        <br />

        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={() => {
            if (!userId) return alert("Please enter a user ID");
            CentralApiService("get", `get-user/${userId}`).then((data) =>
              console.log(data)
            );
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get user
        </button>
        <br />
        <br />

        <input
          type="number"
          placeholder="Enter User ID"
          value={userIdDelete}
          onChange={(e) => setUserIdDelete(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={() => {
            if (!userIdDelete) return alert("Please enter a user ID");
            CentralApiService("delete", `delete-user/${userIdDelete}`).then(
              (data) => console.log(data)
            );
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete user
        </button>
        <br />
        <br />

        <input
          type="text"
          placeholder="Enter IDs like: 1, 2, 3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Bulk Delete
        </button>
        <br />
        <br />

        <button
          onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
        <br />
        <br />
        <div>
          <h2 className="text-xl font-bold mb-4">Register New Admin</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border px-2 py-1"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border px-2 py-1"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="border px-2 py-1"
            />
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              className="border px-2 py-1"
            />
            <button
              type="submit"
              className="bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Register Admin
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
      </div>

      <div>
        <div>
          <h1>Tenant Management</h1>
          <button
            onClick={() => {
              CentralApiService("get", "tenant/all").then((data) =>
                console.log(data)
              );
            }}
          >
            get all tenants
          </button>
        </div>

        <div>
          <h2>get Tenant</h2>
          <input
            type="text"
            placeholder="Enter Tenant ID"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="border px-2 py-1 mr-2"
          />
          <button
            onClick={() => {
              if (!tenantId) return alert("Please enter a user ID");
              CentralApiService("get", `tenant/${tenantId}`).then((data) =>
                console.log(data)
              );
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Tenant
          </button>
          <br />
          <br />
        </div>

        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Register New Tenant</h2>
          <form onSubmit={handleSubmitTenant} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Tenant Name"
              value={formTenant.name}
              onChange={handleChangeTenant}
              required
              className="border px-2 py-1"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formTenant.email}
              onChange={handleChangeTenant}
              required
              className="border px-2 py-1"
            />
            <input
              type="text"
              name="domain"
              placeholder="Domain (e.g. tenant_1)"
              value={formTenant.domain}
              onChange={handleChangeTenant}
              required
              className="border px-2 py-1"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formTenant.password}
              onChange={handleChangeTenant}
              required
              className="border px-2 py-1"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded"
            >
              Create Tenant
            </button>
          </form>
          {errorTenant && <p className="text-red-500 mt-2">{errorTenant}</p>}
          {successTenant && (
            <p className="text-green-500 mt-2">{successTenant}</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Delete Tenant</h2>
          <input
            type="text"
            placeholder="Tenant Domain to Delete (e.g. Tenant_1)"
            value={deleteTenantDomain}
            onChange={(e) => setDeleteTenantDomain(e.target.value)}
            className="border px-3 py-2 w-full mb-2"
          />
          <button
            onClick={handleTenantDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Delete Tenant
          </button>
        </div>
      </div>
    </div>
  );
}
