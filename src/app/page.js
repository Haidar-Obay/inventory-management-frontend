'use client'
import React from "react";
import apiService from "@/API/ApiService";
 
export default function Home() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button
        onClick={() => {
          apiService("get", "tenant/all").then((data) => console.log(data));
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Tenants
      </button>
    </div>
  );
}
