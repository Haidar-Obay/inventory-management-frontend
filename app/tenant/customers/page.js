"use client"

import Table from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import tenantApiService from "@/API/TenantApiService.js"; 

// Sample Data
const data = [
  { id: 1, name: "John Doe", age: 30, isActive: true, joinDate: "2022-01-15" },
  { id: 2, name: "Jane Smith", age: 25, isActive: false, joinDate: "2021-07-12" },
  { id: 3, name: "Sam Johnson", age: 35, isActive: true, joinDate: "2023-04-23" },
  { id: 4, name: "Emma Brown", age: 28, isActive: true, joinDate: "2022-06-30" },
  { id: 5, name: "Michael Scott", age: 45, isActive: false, joinDate: "2020-04-18" },
  { id: 6, name: "Dwight Schrute", age: 40, isActive: true, joinDate: "2019-12-21" },
  { id: 7, name: "Pam Beesly", age: 32, isActive: false, joinDate: "2018-05-10" },
  { id: 8, name: "Jim Halpert", age: 31, isActive: true, joinDate: "2017-03-19" },
  { id: 9, name: "Stanley Hudson", age: 55, isActive: false, joinDate: "2016-08-14" },
  { id: 10, name: "Angela Martin", age: 29, isActive: true, joinDate: "2021-11-05" },
  { id: 11, name: "Kevin Malone", age: 34, isActive: false, joinDate: "2021-09-22" },
  { id: 12, name: "Oscar Martinez", age: 37, isActive: true, joinDate: "2023-02-15" },
  { id: 13, name: "Andy Bernard", age: 33, isActive: true, joinDate: "2020-07-01" },
  { id: 14, name: "Erin Hannon", age: 26, isActive: true, joinDate: "2021-03-11" },
  { id: 15, name: "Toby Flenderson", age: 41, isActive: false, joinDate: "2019-10-30" },
  { id: 16, name: "Meredith Palmer", age: 50, isActive: false, joinDate: "2015-06-18" },
  { id: 17, name: "Ryan Howard", age: 27, isActive: true, joinDate: "2022-12-01" },
  { id: 18, name: "Kelly Kapoor", age: 29, isActive: false, joinDate: "2020-09-07" },
  { id: 19, name: "Phyllis Vance", age: 52, isActive: true, joinDate: "2018-04-13" },
  { id: 20, name: "Creed Bratton", age: 65, isActive: false, joinDate: "2016-10-08" }
];


const FetchCustomers = async () => {
  try {
    const response = await tenantApiService("GET", "customers");
    console.log("Customers fetched successfully:");
    return response;
  } catch (err) {
    console.error("Error fetching customers:", err);
    return [];
  }
};



// Column definitions
const columns = [
  { key: "id", header: "ID", type: "number" },
  { key: "name", header: "Name", type: "text" },
  { key: "age", header: "Age", type: "number" },
  { key: "isActive", header: "Active", type: "boolean" },
  { key: "joinDate", header: "Join Date", type: "date" },
];


export default function Home() {
  // Handle edit action
  const handleEdit = (row) => {
    console.log("Editing row:", row);
    // Implement your edit logic here
  };

  // Handle delete action
  const handleDelete = (row) => {
    console.log("Deleting row:", row);
    // Implement your delete logic here
  };

  // Action toolbar handlers
  const handleAdd = () => {
    console.log("Add new customer");
    // Implement add logic here
  };

  const handleExportExcel = () => {
    console.log("Export to Excel");
    // Implement export logic here
  };

  const handleExportPdf = () => {
    console.log("Export to PDF");
    // Implement PDF export logic here
  };

  const handlePrint = () => {
    console.log("Print");
    // Implement print logic here
  };

  const handleRefresh = async () => {
    console.log("Refreshing data");
    const customers = await FetchCustomers();
    console.log(customers);
  };




  return (
    <div className="min-h-screen w-full bg-gray-100 p-0 m-0 -mt-px -ml-px">
      <h1 className="px-1 pb-10 text-3xl font-bold text-gray-900">Customers</h1>
      
      <div className="mx-auto w-full bg-white">
        <Table
          data={data}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onPrint={handlePrint}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
