"use client";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ul className="space-y-2">
        <li>
          <Link
            href="/tenant/main/dashboard/overview"
            className="text-blue-600 hover:underline"
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            href="/tenant/main/dashboard/analytics"
            className="text-blue-600 hover:underline"
          >
            Analytics
          </Link>
        </li>
        <li>
          <Link
            href="/tenant/main/dashboard/reports"
            className="text-blue-600 hover:underline"
          >
            Reports
          </Link>
        </li>
      </ul>
    </div>
  );
}
