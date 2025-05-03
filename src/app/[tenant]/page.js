"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function TenantHome() {
  const { tenant } = useParams();
  const router = useRouter();
  return (
    <div>
      <h1>🏢 Tenant Domain - Welcome {tenant}</h1>
      <button
        onClick={() => router.push(`/${tenant}/login`)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
}
