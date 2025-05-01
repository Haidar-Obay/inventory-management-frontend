"use client";
import { useParams } from "next/navigation";
import apiService from "@/API/CentralApiService";
export default function TenantHome() {
  const { tenant } = useParams();

  return (
    <div>
      <h1>🏢 Tenant Domain - Welcome {tenant}</h1>;
      <button
        onClick={() => {
          apiService("get", "get-all-users").then((data) => console.log(data));
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Tenants
      </button>
    </div>
  );
}
